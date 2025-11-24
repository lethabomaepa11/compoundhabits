

export const load = async ({ locals: { supabase } }) => {
    

    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) { 
        const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
        profile = data;
        if(!profile){
            //update a profile that has the same email as the user, there is no way the user login without having signed up first
            const { data: newProfile } = await supabase.from("users").update([{
                id: user.id,
            }]).eq("email", user.email).select().single();
            
            profile = newProfile;
        }
    }

    return {profile, isLoggedIn: !!user};

}