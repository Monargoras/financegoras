import { ActionIcon, Popover, Text } from '@mantine/core'
import { IconInfoSquare } from 'tabler-icons'

interface MobileTooltipPopoverProps {
  label: string
}

export default function MobileTooltipPopover(props: MobileTooltipPopoverProps) {
  return (
    <Popover>
      <Popover.Target>
        <ActionIcon variant="transparent" size={30}>
          <IconInfoSquare stroke={1.5} size={24} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm" maw={250}>
          {props.label}
        </Text>
      </Popover.Dropdown>
    </Popover>
  )
}
