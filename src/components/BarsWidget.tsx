import React from 'react';

import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { BarSeriesType, AxisConfig } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import { applyFilters } from '@arandu/laravel-mui-admin';
import useBarChart from '../useBarChart';
import { TitleBar } from './layouts/Titlebar';

const BarWidget = (props: WidgetProps) => {

    const barChartProps = useBarChart(props);

    return (
        <>
            <TitleBar>{props.title}</TitleBar>
            <BarChart
                {...barChartProps}
            />
        </>
    );
}

export default BarWidget;
