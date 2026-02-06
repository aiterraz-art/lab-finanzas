
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function checkTables() {
    const { data, error } = await supabase
        .from('terceros')
        .select('id')
        .limit(1)

    if (error) {
        console.log("Error al consultar 'terceros' en public:", error.message)
    } else {
        console.log("'terceros' existe en public")
    }

    const { data: data2, error: error2 } = await supabase
        .from('facturas')
        .select('id')
        .limit(1)

    if (error2) {
        console.log("Error al consultar 'facturas' en public:", error2.message)
    } else {
        console.log("'facturas' existe en public")
    }
}

checkTables()
