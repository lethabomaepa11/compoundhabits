import {User} from "$lib/types/models"
import { json, redirect } from "@sveltejs/kit";



/**
 * This accepts all auth related routes such as login, signup, logout etc.
 * and performs the necessary actions.
 */

let route: string;


export const POST = async ({ request, params, locals: { supabase } }) => {
    route = params.route;

    switch (route) {
        //SIGNUP 
        case 'signup': {
            const { email, password, fname, lname } = await request.json();
            const user = new User("00", email, fname, lname);
            const result = await signUp(user, password, supabase);
            return json({ error: result.error, ok: result.ok }, { status: result.status });
        }
        //LOGIN
        case 'login': {
            const { email, password } = await request.json();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                return json({ error: error.message }, { status: 400 });
            }
            return json({ error: null, data, ok: true }, { status: 200 });
        }
        //NOT FOUND
        default:
            return json({ error: 'Invalid route' }, { status: 400 });
    }
};


export const GET = async ({ params, locals: { supabase } }) => {
    route = params.route;

    switch (route) {
        //LOGOUT
        case 'logout': {
            const { error } = await supabase.auth.signOut();
            if (error) {
                return json({ error: error.message }, { status: 400 });
            }
            redirect(303, '/');
            return json({ error: null, ok: true }, { status: 200 });
        }
        //NOT FOUND
        default:
            return json({ error: 'Invalid route' }, { status: 400 });
    }
};


async function signUp(user: User, password: string, supabase) {
    // sign up logic
    const {data, error} = await supabase.auth.signUp({
        email: user.email,
        password: password,
    });

    //add the user to the users table and link later
    const {data: userData, error: userError} = await supabase.from("users").insert({
        email: user.email,
        first_name: user.fname,
        last_name: user.lname
    }).select().single();

    if (error) {
        return {error: error.message, status: 400};
    }

    return {ok: true, status: 200};
}

