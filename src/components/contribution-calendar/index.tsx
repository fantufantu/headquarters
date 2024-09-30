import { useParentSize } from '@aiszlab/relax'
import { Group } from '@visx/group'
import { HeatmapRect } from '@visx/heatmap'
import { Tooltip } from 'musae'

const BIN_SIZE = 10

const ContributionCalendar = () => {
  const { parentRef, height, width } = useParentSize()

  return (
    <div ref={parentRef} className='w-full h-full'>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} rx={14} />

        <Group top={4} left={4}>
          <HeatmapRect
            data={[]}
            xScale={(x) => x * BIN_SIZE}
            yScale={(y) => y * BIN_SIZE}
            binWidth={BIN_SIZE}
            binHeight={BIN_SIZE}
            gap={2}
          >
            {(heatmap) =>
              heatmap.map((bins) =>
                bins.map((bin) => (
                  <Tooltip key={`heatmap-rect-${bin.row}-${bin.column}`} title='测试'>
                    <rect
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y}
                      fill={bin.color}
                      fillOpacity={bin.opacity}
                    />
                  </Tooltip>
                ))
              )
            }
          </HeatmapRect>
        </Group>
      </svg>
    </div>
  )
}

export default ContributionCalendar
