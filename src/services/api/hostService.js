import hosts from "@/services/mockData/hosts.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const hostService = {
  async getAll() {
    await delay(300);
    return [...hosts];
  },

  async getById(id) {
    await delay(200);
    return hosts.find(host => host.Id === id) || null;
  },

  async create(hostData) {
    await delay(400);
    const newHost = {
      ...hostData,
      Id: Math.max(...hosts.map(h => h.Id)) + 1,
      joinedDate: new Date().toISOString()
    };
    hosts.push(newHost);
    return newHost;
  },

  async update(id, data) {
    await delay(300);
    const index = hosts.findIndex(host => host.Id === id);
    if (index === -1) return null;
    
    hosts[index] = { ...hosts[index], ...data };
    return hosts[index];
  },

  async delete(id) {
    await delay(200);
    const index = hosts.findIndex(host => host.Id === id);
    if (index === -1) return false;
    
    hosts.splice(index, 1);
    return true;
  }
};