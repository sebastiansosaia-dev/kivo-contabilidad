import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useVentas() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      const { data: rows, error: err } = await supabase
        .from('ventas')
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
      .channel('ventas-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ventas' },
        (payload) => setData((prev) => [payload.new, ...prev])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ventas' },
        (payload) =>
          setData((prev) =>
            prev.map((item) => (item.id === payload.new.id ? payload.new : item))
          )
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'ventas' },
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

  const today = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return data.filter((v) => v.fecha === hoy)
  }, [data])

  const totalesHoy = useMemo(
    () => ({
      ventas: today.length,
      ingresos: today.reduce((s, v) => s + Number(v.ingreso_total || 0), 0),
      costos: today.reduce((s, v) => s + Number(v.costo_total || 0), 0),
      ganancia: today.reduce((s, v) => s + Number(v.ganancia_bruta || 0), 0),
    }),
    [today]
  )

  const totalesGlobal = useMemo(
    () => ({
      ingresos: data.reduce((s, v) => s + Number(v.ingreso_total || 0), 0),
      costos: data.reduce((s, v) => s + Number(v.costo_total || 0), 0),
      ganancia: data.reduce((s, v) => s + Number(v.ganancia_bruta || 0), 0),
      cantidad: data.length,
    }),
    [data]
  )

  const ventasPorProducto = useMemo(() => {
    const map = {}
    data.forEach((v) => {
      const p = v.producto || 'Otro'
      if (!map[p]) map[p] = { producto: p, ingresos: 0, ganancia: 0, cantidad: 0 }
      map[p].ingresos += Number(v.ingreso_total || 0)
      map[p].ganancia += Number(v.ganancia_bruta || 0)
      map[p].cantidad += 1
    })
    return Object.values(map).sort((a, b) => b.ingresos - a.ingresos)
  }, [data])

  const ventasPorDia = useMemo(() => {
    const map = {}
    data.forEach((v) => {
      const f = v.fecha
      if (!f) return
      if (!map[f]) map[f] = { fecha: f, ingresos: 0, ganancia: 0, transacciones: 0 }
      map[f].ingresos += Number(v.ingreso_total || 0)
      map[f].ganancia += Number(v.ganancia_bruta || 0)
      map[f].transacciones += 1
    })
    return Object.values(map).sort((a, b) => a.fecha.localeCompare(b.fecha))
  }, [data])

  return {
    data,
    loading,
    error,
    today,
    totalesHoy,
    totalesGlobal,
    ventasPorProducto,
    ventasPorDia,
  }
}
