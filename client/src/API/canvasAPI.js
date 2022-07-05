import { request } from "./requests";

export const fetchCanvas = async (id) => {
    const response = await request.get(`image?id=${id}`);
    return response;
}

export const sendCanvas = async (id, img) => {
    const response = await request.post(`image?id=${id}`, { img });
    return response;
}