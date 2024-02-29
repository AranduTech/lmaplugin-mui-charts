import React from 'react';

import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';
import { AxisConfig, LineSeriesType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import { applyFilters } from '@arandu/laravel-mui-admin';
import { TitleBar } from './layouts/Titlebar';

const LineWidget = ({ 
    args, data, debug, groups, title, 
    layout: { style, options }, 
    uri, values, xAxis: xAxisDefinition,
}: WidgetProps) => {

    const { colors, thresholdColors } = style;

    // const stackStrategy = ;

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



    const series: MakeOptional<LineSeriesType, "type">[] = React.useMemo(() => {
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
                        ? ({ stack: 'total', area: true, stackOffset: 'none' })
                        : {}),
                    color: colors?.[index % colors?.length],
                });
            });
        
    }, [groups, data, values, args]);

    // const series = React.useMemo(() => {
    //     return data
    //         .map((row) => row[groups[0]?.alias || groups[0]?.key] || '')
    //         .filter((value, index, self) => self.indexOf(value) === index)
    //         .map((group) => ({
    //             dataKey: values[0].alias || values[0].key,
    //             label: values[0].name,
    //         }));
    // }, []);

    if (debug) console.log('LineWidget ' + uri, {
        args, data, debug, groups, title,
        uri, values, xAxis, xAxisDefinition,
        series, style, options,
    });

    return (
        <>
            <TitleBar>{title}</TitleBar>
            <LineChart
                xAxis={xAxis}
                series={series}
                height={300}
                slotProps={options}
                {...style}
            />
        </>
    );
}

export default LineWidget;
