import axios from 'axios';

// Function to update the current stop
export async function updateCurrentStop(tripId, updatedStop) {
    try {
        // Fetch the trip data first

        const response = await axios.get(
            `https://api.mybustimes.cc/api/trip/`,
            {
                params: {
                    trip_id: tripId,
                    trip_date_time: '',
                    route_number: '',
                    end_destination: '',
                    vehicle_id: '',
                    route_id: ''
                }
            }
        );

        const tripData = response.data.results[0]; // Store the fetched trip data

        if (!tripData) {
            console.error('Trip data not found');
            return;
        }

        // Prepare the payload with all the original data, but update the current_stop
        const updatedTripData = { ...tripData, current_stop: updatedStop };

        // Send the PUT request to update the current stop
        const updateResponse = await axios.put(
            `https://api.mybustimes.cc/api/trip/${tripId}/`, // Assuming the URL structure
            updatedTripData, // Send the full data with the updated current_stop
            {
                headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // If needed
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Stop Updated:', updateResponse.data);
        return updateResponse.data; // Return the updated data if needed
    } catch (error) {
        console.error('Error updating stop:', error.response ? error.response.data : error.message);
    }
}
