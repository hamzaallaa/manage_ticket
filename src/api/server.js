import axios from './axios.js';


const to = async (promise) => {
    try {
        const response = await promise;
        return response;
    } catch (error) {
        console.log("api error ====> ", error);
    }
};


export default {
    get: async function (module, payload) {
        const res = await to(axios.get(`${module}/get`, { params: payload }))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    findDealer: async function (module, payload) {
        const res = await to(axios.get(`${module}/findDealer`, { params: payload }))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    upload: async function (module, payload) {
        const { data } = await to(axios.post(`${module}/upload`, payload));
        if (!data) throw new Error('Upload failed');
        return data;
    },
    search: async function (module, payload={},headers={}) {
        const res = await to(axios.get(`${module}/search`, { params: payload ,headers:headers}))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    create: async function (module, payload) {
        const res = await to(axios.post(`${module}/create`, payload))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    update: async function (module, payload, headers = {}) { 
        var id = JSON.parse(JSON.stringify(payload)).id; 
        delete payload.id 
        const res = await to(axios.put(`${module}/update?_id=${id}`, payload, { headers: headers }))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    delete: async function (module, payload) {
        const res = await to(axios.delete(`${module}/delete`, { params: payload }))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    find: async function (module, payload) {
        const res = await to(axios.get(`${module}/find`, { params: payload }))
        if (res.error) throw new Error(res.error);
        return res;
    },
    login: async function (module, payload) {
        const res = await to(axios.post(`${module}/login`, payload))
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    signup: async function (module, payload) {
        const res = await to(axios.post(`${module}/signup`, payload))
        if (res.error) throw new Error(res.error)
        return res.data;
    },
    forgotPassword: async function (module, payload) {
        const res = await to(axios.post(`${module}/forgotPassword`, payload))
        if (res.error) throw new Error(res.error)
        return res;
    },
    me: async function (module, payload={}) {
        const res = await to(axios.post(`${module}/me`, { params: payload }))
        if (res.error) throw new Error(res.error)
        return res;
    },
    verificationCode: async function (module, payload) {
        const res = await to(axios.post(`${module}/verificationCode`, payload))
        if (res.error) throw new Error(res.error)
        return res;
    },
    deleteMany: async function (module, payload) {
        const res = await to(axios.post(`${module}/deleteMany`, payload))
        if (res.error) throw new Error(res.error)
        return res;
    },




    import: async function (module, payload) {
        const { data } = await to(axios.post(`${module}/import`, payload))
        if (!data) throw new Error('Delete failed');
        return data;
    },
    export: async function (module, payload) {
        const { data } = await to(axios.get(`${module}/export`, { params: payload }))
        if (!data) throw new Error('Delete failed')
        return data;
    },
    convert: async function (module, payload) {
        const { data } = await to(axios.post(`${module}/convert`, payload))
        if (!data) throw new Error('Delete failed')
        return data;
    }
}