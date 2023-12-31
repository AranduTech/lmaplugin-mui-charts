import React from 'react';

import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';
import { AxisConfig, LineSeriesType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';

const LineWidget = ({ 
    args, data, debug, groups, title,
    uri, values, xAxis: xAxisDefinition,
}: WidgetProps) => {

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
                }
            ];
        }

        const group = groups[0];

        return data
            .map((row) => row[group.alias || group.key] || '')
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((groupAlias) => ({
                // data: data.filter((row) => row[group.alias || group.key] === groupAlias)
                //     .map((row) => row[values[0].alias || values[0].key]),
                data: xAxis[0]?.data?.map((x) => {
                    return data.filter((row) => row[group.alias || group.key] === groupAlias)
                        .find((row) => row[xAxisDefinition[0].alias || xAxisDefinition[0].key] === x)
                        ?.[values[0].alias || values[0].key]
                }),
                label: `${groupAlias}`,
                ...(args?.includes('stacked')
                    ? ({ stack: 'total', area: true, stackOffset: 'none' })
                    : {}),
            }));
        
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
        series,
    });

    return (
        <>
            <Typography>{title}</Typography>
            <LineChart
                xAxis={xAxis}
                series={series}
                height={300}
            />
        </>
    );
}

export default LineWidget;
