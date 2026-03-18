import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useProduccionDulces() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      const { data: rows, error: err } = await supabase
        .from('produccion_dulces')
        .select('*')
        .order('fecha', { ascending: false })

      if (err) throw err
      setData(rows || [])
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('produccion-dulces-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'produccion_dulces' },
        (payload) =>
          setData((prev) => {
            if (prev.some((i) => i.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'produccion_dulces' },
        (payload) =>
          setData((prev) =>
            prev.map((item) => (item.id === payload.new.id ? payload.new : item))
          )
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'produccion_dulces' },
        (payload) =>
          setData((prev) => prev.filter((item) => item.id !== payload.old.id))
      )
      .subscribe()

    intervalRef.current = setInterval(fetchData, 45000)

    return () => {
      supabase.removeChannel(channel)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData])

  const hoy = useMemo(() => {
    const fecha = new Date().toISOString().split('T')[0]
    return data.filter((d) => d.fecha === fecha)
  }, [data])

  const bolsasHoy = useMemo(
    () => hoy.reduce((s, d) => s + Number(d.bolsas || 0), 0),
    [hoy]
  )

  const bolsasTotal = useMemo(
    () => data.reduce((s, d) => s + Number(d.bolsas || 0), 0),
    [data]
  )

  const costoTotal = useMemo(
    () => data.reduce((s, d) => s + Number(d.costo_total || 0), 0),
    [data]
  )

  return { data, loading, error, hoy, bolsasHoy, bolsasTotal, costoTotal }
}
