/**
 * Hardcoded geography for personal inflation (PRD §4).
 * City → stateUt for State Urban CPI. Never ask tier.
 */

export const INFLATION_CITIES = [
  { id: 'new-delhi', name: 'New Delhi', stateUt: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai', stateUt: 'Maharashtra' },
  { id: 'chennai', name: 'Chennai', stateUt: 'Tamil Nadu' },
  { id: 'kolkata', name: 'Kolkata', stateUt: 'West Bengal' },
  { id: 'bangalore', name: 'Bengaluru', stateUt: 'Karnataka' },
  { id: 'pune', name: 'Pune', stateUt: 'Maharashtra' },
  { id: 'hyderabad', name: 'Hyderabad', stateUt: 'Telangana' },
  { id: 'ahmedabad', name: 'Ahmedabad', stateUt: 'Gujarat' },
  { id: 'indore', name: 'Indore', stateUt: 'Madhya Pradesh' },
  { id: 'guwahati', name: 'Guwahati', stateUt: 'Assam' },
  { id: 'kochi', name: 'Kochi', stateUt: 'Kerala' },
  { id: 'chandigarh', name: 'Chandigarh', stateUt: 'Chandigarh' },
  { id: 'jammu', name: 'Jammu', stateUt: 'Jammu & Kashmir' },
  { id: 'lucknow', name: 'Lucknow', stateUt: 'Uttar Pradesh' },
  { id: 'kota', name: 'Kota', stateUt: 'Rajasthan' },
  { id: 'vadodara', name: 'Vadodara', stateUt: 'Gujarat' },
]

export const INFLATION_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export const getInflationCity = (cityId) =>
  INFLATION_CITIES.find((city) => city.id === cityId) || null
