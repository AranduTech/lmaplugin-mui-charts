import React from 'react';

import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';
import { PieSeriesType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';

const PieWidget = ({ 
    args, data, debug, groups, title,
    uri, values,
}: WidgetProps) => {
    const group = groups[0];

    const series: MakeOptional<PieSeriesType<any>, 'type'>[] = React.useMemo(() => {
        const groupedData = data.reduce((acc, row) => {
            const label = row[group.alias || group.key].toString();
            const value = row[values[0].alias || values[0].key];

            if (!acc[label]) {
                acc[label] = {
                    value,
                    label,
                    id: label,
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
            },
        ];
    }, [group, data, values]);

    if (debug) console.log('PieWidget ' + uri, {
        args, data, debug, groups, title,
        uri, values, series,
    });

    return (
        <>
            <Typography>{title}</Typography>
            <PieChart
                series={series}
                height={300}
            />
        </>
    );
}

export default PieWidget;
