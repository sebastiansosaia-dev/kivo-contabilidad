import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useInventario() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      const { data: rows, error: err } = await supabase
        .from('inventario')
        .select('*')
        .order('nivel_estado', { ascending: true })

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
      .channel('inventario-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'inventario' },
        (payload) =>
          setData((prev) => {
            if (prev.some((i) => i.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'inventario' },
        (payload) =>
          setData((prev) =>
            prev.map((item) => (item.id === payload.new.id ? payload.new : item))
          )
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'inventario' },
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

  const alertas = useMemo(
    () => data.filter((i) => i.nivel_estado === 'rojo' || i.nivel_estado === 'amarillo'),
    [data]
  )

  const porEstado = useMemo(
    () => ({
      rojo: data.filter((i) => i.nivel_estado === 'rojo'),
      amarillo: data.filter((i) => i.nivel_estado === 'amarillo'),
      verde: data.filter((i) => i.nivel_estado === 'verde'),
    }),
    [data]
  )

  const conteo = useMemo(
    () => ({
      total: data.length,
      rojo: porEstado.rojo.length,
      amarillo: porEstado.amarillo.length,
      verde: porEstado.verde.length,
    }),
    [data, porEstado]
  )

  return { data, loading, error, alertas, porEstado, conteo }
}
