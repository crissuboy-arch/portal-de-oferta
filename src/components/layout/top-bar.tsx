'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface TopBarCampaign {
  id: string
  is_active: boolean
  title: string
  subtitle: string | null
  link_url: string | null
  link_text: string | null
  speed: number // pixels per second
  start_date: string | null
  end_date: string | null
  created_at: string
}

export function TopBar() {
  const [campaign, setCampaign] = useState<TopBarCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    fetchActiveCampaign()
  }, [])

  useEffect(() => {
    if (campaign && campaign.is_active) {
      const interval = setInterval(() => {
        setPosition(prev => {
          const newPos = prev - (campaign.speed / 60) // Update 60 times per second
          const textWidth = (campaign.title.length + (campaign.subtitle?.length || 0)) * 8
          return newPos < -textWidth ? window.innerWidth : newPos
        })
      }, 16) // ~60fps

      return () => clearInterval(interval)
    }
  }, [campaign])

  const fetchActiveCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('top_bar_campaigns')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar campanha:', error)
      }

      if (data) {
        setCampaign(data)
      }
    } catch (error) {
      console.error('Erro ao buscar campanha:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (!campaign || !campaign.is_active) {
    return null
  }

  // Verificar se está dentro do período da campanha
  const now = new Date()
  const startDate = campaign.start_date ? new Date(campaign.start_date) : null
  const endDate = campaign.end_date ? new Date(campaign.end_date) : null

  if (startDate && now < startDate) {
    return null
  }

  if (endDate && now > endDate) {
    return null
  }

  return (
    <div className="w-full h-12 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden relative">
      <div 
        className="absolute top-0 left-0 h-full flex items-center whitespace-nowrap"
        style={{ transform: `translateX(${position}px)` }}
      >
        <div className="flex items-center space-x-4 px-4 text-sm font-medium">
          <span className="text-white">
            {campaign.title}
          </span>
          {campaign.subtitle && (
            <span className="text-orange-300">
              {campaign.subtitle}
            </span>
          )}
          {campaign.link_url && campaign.link_text && (
            <a 
              href={campaign.link_url}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {campaign.link_text} →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}