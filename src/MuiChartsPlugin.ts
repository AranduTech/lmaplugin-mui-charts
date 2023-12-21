
import { LaravelMuiAdminPlugin } from '@arandu/laravel-mui-admin/lib/types/plugin';

const MuiChartsPlugin: LaravelMuiAdminPlugin = {
    macros: () => {
        console.log('Plugin being loaded...');

    },

};

export default MuiChartsPlugin;
