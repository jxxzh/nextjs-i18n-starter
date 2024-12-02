'use client'

import type { FC } from 'react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface DateFormatProps {
  date?: string
  format?: string
}

const DateFormat: FC<DateFormatProps> = ({
  date,
  format,
}) => {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    setFormattedDate(dayjs(date).format(format))
  }, [date, format])

  // 在客户端渲染前返回空字符串或占位符
  if (!formattedDate) {
    return null
  }

  return formattedDate
}

export default DateFormat
