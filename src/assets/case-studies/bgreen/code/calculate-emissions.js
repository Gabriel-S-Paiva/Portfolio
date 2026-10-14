    async calculateEmissions(appliance, hoursUsed) {
      this.isCalculating = true
      this.error = null
      
      try {
        const result = await calculateApplianceEmissions(appliance, hoursUsed)
        
        if (result.success) {
          this.lastCalculation = {
            appliance_id: appliance.id,
            timestamp: new Date().toISOString(),
            hoursUsed,
            ...result.data,
          }
        }
        
        return result
      } catch (error) {
        console.error('Error calculating emissions:', error)
        this.error = error.message
        
        // Fallback to local calculation
        const fallback = this.calculateEmissionsLocal(appliance, hoursUsed)
        return {
          success: true,
          data: fallback,
          source: 'local',
        }
      } finally {
        this.isCalculating = false
      }
    },
    
    /**
     * Local calculation fallback (when API unavailable)
     * Uses powerWatts from appliance
     * 
     * @param {Object} appliance - The appliance object
     * @param {number} hoursUsed - Duration in hours
     * @returns {Object} - Calculated energy and CO2 data
     */
    calculateEmissionsLocal(appliance, hoursUsed) {
      // Use powerWatts from appliance or fallback
      const powerWatts = appliance.powerWatts || 200
      const minutes = Math.round(hoursUsed * 60)
      
      // Calculate energy in kWh: (watts * hours) / 1000
      const kwh = (powerWatts * hoursUsed) / 1000
      
      // Portuguese grid average: ~0.188 kg CO2/kWh
      const co2 = kwh * 0.188
      
      return {
        type: appliance.type || 'electricity',
        carbon_kg_co2: co2,
        minutes: minutes,
        kwh: kwh,
        device_power_watts: powerWatts,
        source: 'local',
      }
    },
