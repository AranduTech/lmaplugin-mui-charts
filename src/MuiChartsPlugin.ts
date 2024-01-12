
import { addFilter } from '@arandu/laravel-mui-admin';

import { LaravelMuiAdminPlugin } from '@arandu/laravel-mui-admin/lib/types/plugin';
import { WidgetProps } from '@arandu/laravel-mui-admin/lib/components/Widgets/Widget';

import BarsWidget from './components/BarsWidget';
import LineWidget from './components/LineWidget';
import PieWidget from './components/PieWidget';

type WidgetTypeMap = { 
    [key: string]: (props: WidgetProps) => JSX.Element 
};

const MuiChartsPlugin: LaravelMuiAdminPlugin = {
    macros: () => {
        addFilter('widget_type_component_map', (map: WidgetTypeMap) => ({
            ...map,
            line: LineWidget,
            bars: BarsWidget,
            pie: PieWidget,
        }));

        addFilter('mui_charts_widget_label', (label: string, {row, group}) => {
            if (group.type == 'BelongsToDimension') {
                return row[group.relation].name;
            }
            return label;
        })
    },

};

export default MuiChartsPlugin;
