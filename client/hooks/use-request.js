import axios from "axios";
import { useState } from "react";

function useRequest({ url, method, body, onSucces }) {
  const [errors, setErrors] = useState([]);

  async function doRequest() {
    try {
      setErrors([]);
      const response = await axios[method](url, body);

      onSucces();

      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  }
  return { doRequest, errors };
}

export default useRequest;
