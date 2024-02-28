import { applyFilters } from "@arandu/laravel-mui-admin";
import { WidgetProps } from "@arandu/laravel-mui-admin/lib/components/Widgets/Widget";
import { AxisConfig } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/models/helpers";
import React from "react";


export default function useBarChart(props: WidgetProps)
{
    const {
        groups, xAxis, values, data, layout, debug,
        args = [],
    } = props;

    const {
        style: { 
            colors = [],
            ...style
        } = {}, options = {}
    } = layout;

    if (debug) {
        if (groups.length > 1) {
            console.warn('Plugin Mui Chart does not support more than one group');
        }
        if (xAxis.length > 1) {
            console.warn('Plugin Mui Chart does not support more than one xAxis');
        }
        if (values.length > 1) {
            console.warn('Plugin Mui Chart does not support more than one value');
        }
    }

    const groupDefinition = groups[0];
    const axisDefinition = xAxis[0];
    const valueDefinition = values[0];

    const axis: MakeOptional<AxisConfig, "id">[] = React.useMemo(() => {
        return [
            {
                data: data.map((row) => row[axisDefinition.alias || axisDefinition.key])
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .sort(),
                label: axisDefinition.name,
                scaleType: 'band',
            }
        ];
    }, [data]);

    const series = React.useMemo(() => {
        if (!groupDefinition) {
            return [
                {
                    data: data.map((row) => row[valueDefinition.alias || valueDefinition.key]),
                    label: valueDefinition.name,
                    color: colors?.[0] || undefined,
                }
            ];
        }
        return data
            .map((row) => row[groupDefinition.alias || groupDefinition.key] || '') // user_ids
            .filter((value, index, self) => self.indexOf(value) === index) // unique
            .map((groupId, index) => {

                return {
                    data: axis[0]?.data?.map((x) => {
                        return data.filter((row) => row[groupDefinition.alias || groupDefinition.key] === groupId)
                            .find((row) => row[axisDefinition.alias || axisDefinition.key] === x)?.[valueDefinition.alias || valueDefinition.key];
                    }),
                    label: applyFilters(
                        'mui_charts_widget_label',
                        groupId,
                        { 
                            row: data.find((row) => row[groupDefinition.alias || groupDefinition.key] === groupId),
                            group: groupDefinition,
                        }
                    ),
                    ...(args?.includes('stacked')
                        ? ({ stack: 'total' })
                        : {}),
                    color: colors?.[index % colors?.length],
                };
            });
    }, [data]);

    const layoutProp = args.includes('horizontal')
        ? 'horizontal'
        : 'vertical';

    const barChartProps = {
        series,
        height: 300,
        layout: layoutProp,
        slotProps: options,
        [layoutProp === 'horizontal' ? 'yAxis' : 'xAxis']: axis,
        ...style,
    };


    if (debug) console.log('BarWidget ' + props.uri, { in: props, out: barChartProps });

    return barChartProps;

}
