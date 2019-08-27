import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { curveLinear, line, scaleLinear, symbol, symbolCircle } from 'd3'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import {
  COMMS_KEYS,
  COMMS_GROUPS,
  STAKEHOLDER_STATUSES,
  STAKEHOLDER_STATUS_COLORS,
  STATUS_WEIGHT
} from '../../constants'

const lineColor = blueGrey[50]

const useStyles = makeStyles(theme => ({
  axisLabel: {
    ...theme.typography.caption,
    fill: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold
  },
  legendTitle: {
    ...theme.typography.caption,
    fill: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold
  },
  legendLabel: {
    ...theme.typography.caption,
    fill: theme.palette.text.primary,
  },
  mapItemClickable: {
    '&:hover, &:focus': {
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  },
  mapItemLabel: {
    ...theme.typography.caption,
    fill: theme.palette.text.primary,
  },
  quadrantLabel: {
    ...theme.typography.caption,
    fill: blueGrey[400]
  }
}))

const EngagementMap = props => {
  const classes = useStyles()

  const legendRef = useRef(null)

  useEffect(() => {
    const alignLegend = () => {
      let x = 0

      legendRef.current.childNodes.forEach((item, index) => {
        if (index === 0) {
          // Position the row title.
          item.setAttribute('transform', `translate(-8, 0)`)
        } else {
          // Translate the group (symbol and text)
          item.setAttribute('transform', `translate(${x}, 25)`)

          // Translate the text, so it's to the right of the symbol.
          item.childNodes[1].setAttribute(
            'transform',
            `translate(${item.childNodes[0].getBBox().width})`
          )

          // Set the start position for the next group.
          const bb = item.getBBox()
          x += bb.width + 30
        }
      })
    }

    alignLegend()
  }, [])

  const handleStakeholderClick = id => {
    return () => {
      props.onStakeholderClick(id)
    }
  }

  const xScale = scaleLinear()
    .domain([1, 10])
    .range([props.paddingX + (props.paddingX / 2), props.width - (props.paddingX * 3)])

  const yScale = scaleLinear()
    .domain([10, 1])
    .range([props.paddingY * 4, props.height - (props.paddingY * 4)])

  const lineFunc = line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(curveLinear)

  const data = () => {
    const groups = props.stakeholders.reduce((result, stakeholder) => {
      const key = `${stakeholder.influence}${stakeholder.interest}`

      if (result[key] === undefined) {
        result[key] = []
      }

      result[key].push({
        x: stakeholder.influence,
        y: stakeholder.interest,
        text: `${stakeholder.firstName} ${stakeholder.surname}`,
        status: stakeholder.relationshipStatus,
        onClick: handleStakeholderClick(stakeholder.id)
      })

      return result
    }, {})

    return Object.keys(groups).map(key => groups[key])
  }

  const points = data().map((point, index) => {
    const x = xScale(point[0].x)
    const y = yScale(point[0].y)
    const groupStatus = point.reduce((result, p) => {
      if (STATUS_WEIGHT[p.status] > STATUS_WEIGHT[result]) {
        return p.status
      }

      return result
    }, point[0].status)

    return (
      <g
        key={index.toString()}
      >
        <path
          d={
            symbol()
              .type(symbolCircle)
              .size(155)()
          }
          transform={`translate(${x}, ${y})`}
          fill={STAKEHOLDER_STATUS_COLORS[groupStatus]}
        />

        {
          point
            .sort((a, b) => STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status])
            .map((p, i) => {
              const isClickable = p.onClick !== undefined

              return (
                <text
                  key={i.toString()}
                  className={isClickable
                    ? clsx(classes.mapItemLabel, classes.mapItemClickable)
                    : classes.mapItemLabel
                  }
                  x={x}
                  y={y}
                  dy={`${i * 18}`}
                  textAnchor={'start'}
                  transform={`rotate(45, ${x - 8}, ${y + 16})`}
                  dominantBaseline='middle'
                  onClick={isClickable ? p.onClick : null}
                >
                  {p.text}
                </text>
              )
            })
        }
      </g>
    )
  })

  const legendItems = Object
    .keys(STAKEHOLDER_STATUSES)
    .reduce((result, key) => {
      return [
        ...result,
        {
          title: STAKEHOLDER_STATUSES[key],
          symbol: {
            draw: (context, size) => {
              const w = Math.sqrt(size)
              const x = -w / 2
              context.rect(x, x, w * 3, w * 0.68)
            }
          },
          fill: STAKEHOLDER_STATUS_COLORS[key]
        }
      ]
    }, [])

  const legend = (
    <g
      ref={legendRef}
      transform={`translate(${xScale(1) + 8}, ${yScale(11.75)})`}
    >
      <text className={classes.legendTitle}>
        Key &mdash; Relationship status
      </text>
      {legendItems.map((item, itemIndex) => (
        <g key={itemIndex.toString()}>
          <path
            d={
              symbol()
                .type(symbolCircle)
                .size(155)()
            }
            fill={item.fill}
          />
          <text
            className={classes.legendLabel}
            dominantBaseline='middle'
          >
            {item.title}
          </text>
        </g>
      ))}
    </g>
  )

  const background = (
    <path
      d={lineFunc([{ x: 1, y: 1 }, { x: 1, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 1 }, { x: 1, y: 1 }])}
      fill='#fff'
    />
  )

  const xAxis = (
    <React.Fragment>
      <line
        stroke={lineColor}
        x1={xScale(1)}
        x2={xScale(10)}
        y2={yScale(5.5)}
        y1={yScale(5.5)}
      />
      <text
        className={classes.axisLabel}
        textAnchor='middle'
        x={xScale(5.5)}
        y={props.height}
      >
        {props.labelX}
      </text>
    </React.Fragment>
  )

  const yAxis = (
    <React.Fragment>
      <line
        stroke={lineColor}
        x2={xScale(5.5)}
        x1={xScale(5.5)}
        y2={yScale(10)}
        y1={yScale(1)}
      />
      <text
        className={classes.axisLabel}
        textAnchor='middle'
        transform={`translate(${props.paddingX / 2}, ${yScale(5) - (props.paddingY / 2)}) rotate(-90)`}
      >
        {props.labelY}
      </text>
    </React.Fragment>
  )

  const topLeftLabel = (
    <text
      className={classes.quadrantLabel}
      x={xScale(3.25)}
      y={yScale(9.5)}
      textAnchor='middle'
    >
      {COMMS_GROUPS[COMMS_KEYS.INFORMED]}
    </text>
  )

  const topRightLabel = (
    <text
      className={classes.quadrantLabel}
      x={xScale(7.75)}
      y={yScale(9.5)}
      textAnchor='middle'
    >
      {COMMS_GROUPS[COMMS_KEYS.MANAGE]}
    </text>
  )

  const bottomLeftLabel = (
    <text
      className={classes.quadrantLabel}
      x={xScale(7.75)}
      y={yScale(1.25)}
      textAnchor='middle'
    >
      {COMMS_GROUPS[COMMS_KEYS.SATISFIED]}
    </text>
  )

  const bottomRightLabel = (
    <text
      className={classes.quadrantLabel}
      x={xScale(3.25)}
      y={yScale(1.25)}
      textAnchor='middle'
    >
      {COMMS_GROUPS[COMMS_KEYS.MONITOR]}
    </text>
  )

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox={`0 0 ${props.width} ${props.height}`}
      preserveAspectRatio='xMinYMid'
    >
      {legend}
      {background}
      {xAxis}
      {yAxis}
      {topLeftLabel}
      {topRightLabel}
      {bottomRightLabel}
      {bottomLeftLabel}
      {points}
    </svg>
  )
}

EngagementMap.propTypes = {
  height: PropTypes.number.isRequired,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  onStakeholderClick: PropTypes.func,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
  stakeholders: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired
}

EngagementMap.defaultProps = {
  labelX: 'Level of influence',
  labelY: 'Level of interest',
  onStakeholderClick: () => {},
  paddingX: 40,
  paddingY: 30
}

export default EngagementMap
