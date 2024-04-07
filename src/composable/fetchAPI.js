const API_ROOT = import.meta.env.VITE_API_ROOT
const url = `${API_ROOT}`


const getAnnouncements = async () => {
  try {
    const res = await fetch(url + `/api/announcements`, {
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
  } catch (err) {
    console.log(err)
  }
}

async function getIdAnnouncement(id) {
  try {
    const res = await fetch(url + "/api/announcements/" + id, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    if (res.ok) {
      const data = res.json();
      return data;

    } else if (res.status === 404) {

    } else {
      console.log("Can not getAnnouncements")
    }
  } catch (err) {
    console.log(err)
  }
}

//----------------------Sprint 2------------------------------------

async function addAnnounce(announce) {
  try {
    const res = await fetch(url + "/api/announcements", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(announce)
    });

    if (res.ok) {
      console.log("AddNewAnnounce!!!")
    } else {
      console.log("Can not AddNewAnnounce")
    }
  }
  catch (err) {
    console.log(err)
  }
}



async function updateAnnouncement(updatedAnnouncement, id) {
  try {
    const res = await fetch(url + "/api/announcements/" + id, {
      method: "PUT",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      
      body: JSON.stringify(updatedAnnouncement)
    });
    if (res.ok) {
      console.log("Updated!!!");
    } else {
      console.log("Cannot update announcement");
    }
  } catch (err) {
    console.log(err);
  }
}

const getCategory = async () => {
  try {
    const res = await fetch(
      url + "/api/category", {
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

const getIdViewerAnnouncements = async (id) => {
  try {
    const res = await fetch(
      url + `/api/announcements/viewer/${id}`,{
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

const getViewerAnnouncements = async (mode) => {
  try {
    const res = await fetch(
      url + `/api/announcements/viewer?mode=${mode}`,{
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
const getCategoryAnnouncements = async (mode, page,catId) => {
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

//----------------------Sprint 3------------------------------------


const getAllUser = async () => {
  try {
    const res = await fetch(url + `/api/users`, {
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
  } catch (err) {
    console.log(err)
  }
}

const getUserById = async (id) => {
  try {
    const res = await fetch(url + `/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (res.ok) {
      const data = res.json();
      return data;
    } else {
      throw new error("Can not get DATA!!!");
    }
  } catch (error) {
    console.log(error);
  }
};

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

const deleteAnnouncement = async (id) => {
  try {
    {
      const res = await fetch(`${url}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
       });
      if (res.ok) {
        announcement.value = announcement.value.filter((use) => {
          return use.id !== id
        })
      }
      else throw new Error('Oops, sorry cannot delete')
    }
  }
  catch (err) {
    console.log(err)
  }
}

export { getAllUser, getUserById, url, getToken, getAnnouncements, getIdAnnouncement, addAnnounce, updateAnnouncement, getCategory, getCategoryAnnouncements, getViewerAnnouncements, deleteAnnouncement, getIdViewerAnnouncements };