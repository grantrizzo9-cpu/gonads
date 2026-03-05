import axios from 'axios';

const NAMECHEAP_API_URL = 'https://api.namecheap.com/xml.response';

const apiUser = process.env.NAMECHEAP_API_USER;
const apiKey = process.env.NAMECHEAP_API_KEY;
const userName = process.env.NAMECHEAP_USER_NAME;
const clientIp = '127.0.0.1'; // Replace with your whitelisted IP if needed

// Search for domain availability
export async function searchDomain(domain: string) {
  const params = {
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: userName,
    ClientIp: clientIp,
    Command: 'namecheap.domains.check',
    DomainList: domain,
  };
  const response = await axios.get(NAMECHEAP_API_URL, { params });
  return response.data;
}

// Register a domain
export async function registerDomain(domain: string, years: number = 1) {
  const params = {
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: userName,
    ClientIp: clientIp,
    Command: 'namecheap.domains.create',
    DomainName: domain,
    Years: years,
    // Add required contact info here
    RegistrantFirstName: 'John',
    RegistrantLastName: 'Doe',
    RegistrantAddress1: '123 Main St',
    RegistrantCity: 'City',
    RegistrantStateProvince: 'State',
    RegistrantPostalCode: '12345',
    RegistrantCountry: 'US',
    RegistrantPhone: '+1.5555555555',
    RegistrantEmailAddress: 'admin@rizzosai.com',
  };
  const response = await axios.get(NAMECHEAP_API_URL, { params });
  return response.data;
}

// Set DNS records
export async function setDNS(domain: string, hostRecords: Array<{Type: string, Name: string, Address: string}>) {
  const params: any = {
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: userName,
    ClientIp: clientIp,
    Command: 'namecheap.domains.dns.setHosts',
    SLD: domain.split('.')[0],
    TLD: domain.split('.').slice(1).join('.'),
  };
  hostRecords.forEach((record, i) => {
    params[`HostName${i+1}`] = record.Name;
    params[`RecordType${i+1}`] = record.Type;
    params[`Address${i+1}`] = record.Address;
    params[`TTL${i+1}`] = '1800';
  });
  const response = await axios.get(NAMECHEAP_API_URL, { params });
  return response.data;
}
