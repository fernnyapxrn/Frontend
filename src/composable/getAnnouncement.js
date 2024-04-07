const getAllAnnouncement = async () => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/announcements", {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
            })
                
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
    return []
  }
  const getAnnouncementById = async (id) => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/announcements/" + id ,{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
          })
               
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
  }
  const getAnnouncementByIdView = async (id) => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/announcements/" + id + "?count=true",{
              method: 'GET'
          })       
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
  }
  const getCategory = async () => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/category",{
              method: 'GET'
          })        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
    return []
  }

  const getAnnouncementsByPage = async (mode, page) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_ROOT_API}/api/announcements/pages?mode=${mode}&page=${page}`,{
          method: 'GET'
      })
      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        throw new Error("Error, cannot get data!")
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }
  const getAnnouncementsByCategory = async (mode, page,catId) => {
    try {
      const res = await fetch(         
        `${import.meta.env.VITE_ROOT_API}/api/announcements/pages?mode=${mode}&page=${page}&category=${catId}`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
      })
      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        throw new Error("Error, cannot get data!")
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }
  const getAllUsers = async () => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/users",{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
          })
        if (res.ok) {
            const data = res.json();
            return data;
        } else {
            throw new Error('Error, cannot get data!');
        }
    } catch (error) {
        console.log(error);
    }
    return [];
}
  const getUserById = async (id) => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/users/" + id ,{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
          })      
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
  }
  const getToken = async () => {
    console.log("refreshing token");
  
    const res = await fetch(
    import.meta.env.VITE_ROOT_API + "/api/token", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("refreshToken")}}`,
        },
    });
  
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        return data;
    }
  }

  export { getAllAnnouncement,getAnnouncementById,getCategory,getAnnouncementsByPage, getAnnouncementsByCategory,getAnnouncementByIdView,getAllUsers,getUserById,getToken}