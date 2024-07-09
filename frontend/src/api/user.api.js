/**
 * Get a user by their id or username.
 *
 * @param {String} identifier The user's id or username
 *
 * @returns {Promise} An object containing the user and a boolean indicating if the fetching data process is still pending.
 */
const getUser = async (identifier) => {
  try {
    const res = await fetch(`/api/users/${identifier}`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export default getUser;
