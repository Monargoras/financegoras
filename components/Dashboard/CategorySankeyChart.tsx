'use client'

import { useState } from 'react'
import { lighten, useMantineColorScheme, useMantineTheme, useMatches } from '@mantine/core'
import { Layer, Rectangle, Sankey } from 'recharts'
import { CategorySankeyData } from '@/utils/types'

interface CategorySankeyChartProps {
  percentage: boolean
  data: CategorySankeyData
}

export default function CategorySankeyChart(props: CategorySankeyChartProps) {
  const chartWidth = useMatches({
    md: 900,
    sm: 400,
  })

  return (
    <Sankey
      width={chartWidth}
      height={400}
      data={props.data}
      node={<CustomSankeyNode containerWidth={chartWidth} />}
      nodePadding={30}
      margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
      nodeWidth={10}
      sort={false}
      iterations={64}
      link={<CustomSankeyLink />}
    />
  )
}

// recharts has no documentation for custom nodes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomSankeyNode({ containerWidth, x, y, width, height, index, payload }: any) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const isOut = x + width + 6 > containerWidth

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={
          payload.type === 'savings'
            ? colorScheme === 'dark'
              ? theme.colors.blue[5]
              : theme.colors.blue[2]
            : payload.type === 'income'
              ? colorScheme === 'dark'
                ? theme.colors.green[5]
                : theme.colors.green[2]
              : colorScheme === 'dark'
                ? theme.colors.red[5]
                : theme.colors.red[2]
        }
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="16"
        // add white border
        stroke={colorScheme === 'dark' ? theme.white : theme.black}
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        // add white border
        stroke={colorScheme === 'dark' ? theme.white : theme.black}
      >
        {`${Number(payload.value).toFixed(2)}€`}
      </text>
    </Layer>
  )
}

function CustomSankeyLink({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
  payload,
  // recharts has no documentation for custom links
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const [fill, setFill] = useState(
    payload.type === 'savings'
      ? colorScheme === 'dark'
        ? theme.colors.blue[5]
        : theme.colors.blue[2]
      : payload.type === 'income'
        ? colorScheme === 'dark'
          ? theme.colors.green[5]
          : theme.colors.green[2]
        : colorScheme === 'dark'
          ? theme.colors.red[5]
          : theme.colors.red[2]
  )

  return (
    <Layer key={`CustomLink${index}`}>
      <path
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        fill={fill}
        strokeWidth="0"
        onMouseEnter={() => {
          setFill((prev) => lighten(prev, 0.4))
        }}
        onMouseLeave={() => {
          setFill(
            payload.type === 'savings'
              ? colorScheme === 'dark'
                ? theme.colors.blue[5]
                : theme.colors.blue[2]
              : payload.type === 'income'
                ? colorScheme === 'dark'
                  ? theme.colors.green[5]
                  : theme.colors.green[2]
                : colorScheme === 'dark'
                  ? theme.colors.red[5]
                  : theme.colors.red[2]
          )
        }}
      />
    </Layer>
  )
}
