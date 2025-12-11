import { Children, createContext, useContext, useEffect, useState } from "react";

import {supabase} from '../../supabase/supabase-client';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // to set user
        supabase.auth.getSession().then(({data}) => {
            setUser(data.session?.user || null);
            setLoading(false);
        });

        // to udpate user when login, logout, signup , etc
        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const signUp = async ({email, password, full_name}) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {data: {full_name}}
        });

        if(error) throw error;
        return data;
    }

    const signIn = async ({email, password}) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email, 
            password
        });

        if(error) throw error;
        return data;
    }

    const logOut = () => {
        return supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={{user, loading, signUp, signIn, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(AuthContext);
}


// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../../supabase/supabase-client";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // auth user
//   const [profile, setProfile] = useState(null); // user profile
//   const [users, setUsers] = useState([]); // all users
//   const [loading, setLoading] = useState(true);

//   const fetchProfile = async (id) => {
//     const { data, error } = await supabase
//       .from("user_profile")
//       .select("*")
//       .eq("id", id)
//       .single();
//     if (!error) setProfile(data);
//   };

//   const fetchUsers = async () => {
//     const { data, error } = await supabase.from("user_profile").select("*");
//     if (!error) setUsers(data);
//   };

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       const { data: { session } } = await supabase.auth.getSession();
//       const currentUser = session?.user || null;
//       setUser(currentUser);

//       if (currentUser) {
//         await fetchProfile(currentUser.id);
//         await fetchUsers();
//       }

//       setLoading(false);
//     };

//     init();

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       const currentUser = session?.user || null;
//       setUser(currentUser);
//       if (currentUser) fetchProfile(currentUser.id);
//       else setProfile(null);
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   // other functions: signIn, signUp, logOut, updateUserRole, deleteUser
//   // ...

//   return (
//     <AuthContext.Provider value={{ user, profile, users, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
