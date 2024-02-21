import React from 'react';

import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { BarSeriesType, AxisConfig } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import { applyFilters } from '@arandu/laravel-mui-admin';

const BarWidget = ({ 
    args, data, debug, groups, title, 
    layout: { style, options }, 
    uri, values, xAxis: xAxisDefinition,
}: WidgetProps) => {

    const { colors, thresholdColors } = style;

    const xAxis: MakeOptional<AxisConfig, "id">[] = React.useMemo(() => {
        return xAxisDefinition.map((x) => {
            return {
                data: data.map((row) => row[xAxisDefinition[0].alias || xAxisDefinition[0].key])
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .sort(),
                label: x.name,
                scaleType: 'band',
            }
        });
    }, [xAxisDefinition, data]);

    const series: MakeOptional<BarSeriesType, "type">[] = React.useMemo(() => {
        if (groups.length === 0) {
            return [
                {
                    data: data.map((row) => row[values[0].alias || values[0].key]),
                    label: values[0].name,
                    color: colors?.[0],
                }
            ];
        }

        const group = groups[0];

        return data
            .map((row) => row[group.alias || group.key] || '')
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(function (groupAlias, index) {
                let row = data[index];

                const label = applyFilters(
                    'mui_charts_widget_label',
                    row[group.alias || group.key].toString(),
                    { row, group }
                );

                return ({
                    data: xAxis[0]?.data?.map((x) => {
                        return data.filter((row) => row[group.alias || group.key] === groupAlias)
                            .find((row) => row[xAxisDefinition[0].alias || xAxisDefinition[0].key] === x)?.[values[0].alias || values[0].key];
                    }),
                    label: label,
                    ...(args?.includes('stacked')
                        ? ({ stack: 'total' })
                        : {}),
                    color: colors?.[index % colors?.length],
                });
            });
        
    }, [groups, data, values, args, xAxis, xAxisDefinition]);

    if (debug) console.log('BarWidget ' + uri, {
        args, data, debug, groups, title,
        uri, values, xAxis, xAxisDefinition,
        series, style, options,
    });

    let layout: any = 'vertical';
    if (args?.includes('horizontal')) layout = 'horizontal';

    let props = {
        layout,
        [layout === 'horizontal' ? 'yAxis' : 'xAxis']: xAxis,
    }

    return (
        <>
            <Typography>{title}</Typography>
            <BarChart
                series={series}
                height={300}
                slotProps={options}
                {...style}
                {...props}
            />
        </>
    );
}

export default BarWidget;
