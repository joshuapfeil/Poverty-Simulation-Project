import { useEffect, useRef, useState } from 'react'

// Hook that provides families data with EventSource (SSE) and polling fallback
export default function useFamilies(pollInterval = 3000) {
  const [families, setFamilies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const esRef = useRef(null)
  const pollRef = useRef(null)

  const fetchFamilies = async () => {
    try {
      setLoading(true)
      const res = await fetch('/families/')
      const j = await res.json()
      setFamilies(j.data || [])
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let didFallback = false

    // Try SSE first
    try {
      if (typeof window !== 'undefined' && window.EventSource) {
        const es = new EventSource('/families/stream')
        esRef.current = es

        es.onmessage = (evt) => {
          try {
            const payload = JSON.parse(evt.data)
            setFamilies(payload.data || [])
            setLoading(false)
            setError(null)
          } catch (ex) {
            // ignore parse errors
          }
        }

        es.onerror = () => {
          // If SSE errors, fallback to polling
          if (!didFallback) {
            didFallback = true
            es.close()
            esRef.current = null
            fetchFamilies()
            pollRef.current = setInterval(fetchFamilies, pollInterval)
          }
        }

        // success path: return cleanup
        return () => {
          if (esRef.current) esRef.current.close()
          if (pollRef.current) clearInterval(pollRef.current)
        }
      }
    } catch (e) {
      // fall through to polling
    }

    // No SSE available -> polling
    fetchFamilies()
    pollRef.current = setInterval(fetchFamilies, pollInterval)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (esRef.current) esRef.current.close()
    }
  }, [pollInterval])

  // update a single family record in the cached list
  const updateFamily = (updated) => {
    if (!updated) return
    setFamilies(prev => {
      const idx = prev.findIndex(f => f.id === updated.id)
      if (idx === -1) return [updated, ...prev]
      const copy = [...prev]
      copy[idx] = updated
      return copy
    })
  }

  return { families, loading, error, refresh: fetchFamilies, updateFamily }
}
