import React from 'react';

import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';
import { PieSeriesType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import { applyFilters } from '@arandu/laravel-mui-admin';
import { TitleBar } from './layouts/Titlebar';

const PieWidget = ({ 
    args, data, debug, groups, title, 
    layout: { style, options }, 
    uri, values,
}: WidgetProps) => {

    const { colors, thresholdColors } = style;

    const group: any = groups[0];

    const series: MakeOptional<PieSeriesType<any>, 'type'>[] = React.useMemo(() => {
        const groupedData = data.reduce((acc, row, index) => {
            const label = applyFilters(
                'mui_charts_widget_label',
                row[group.alias || group.key].toString(),
                { row, group }
            );
            const value = row[values[0].alias || values[0].key];

            if (!acc[label]) {
                acc[label] = {
                    id: label,
                    value,
                    label,
                    color: colors?.[index % colors?.length],
                };
            } else {
                acc[label].value += value;
            }

            return acc;
        }, {});

        const formattedData = Object.values(groupedData);

        return [
            {
                data: formattedData,
                outerRadius: 90,
                innerRadius: args?.includes('donut') ? 60 : 0,
            },
        ];
    }, [args, group, data, values]);

    if (debug) console.log('PieWidget ' + uri, {
        args, data, debug, groups, title,
        uri, values, series,
    });

    return (
        <>
            <TitleBar>{title}</TitleBar>
            <PieChart
                series={series}
                height={300}
                margin={{ right: 0 }}
                slotProps={options}
                {...style}
            />
        </>
    );
}

export default PieWidget;
