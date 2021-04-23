<template>
  <div class="container">
    <h3>NHL Division Standings</h3>
      <div>
          <label for="cadivDroprs">Select Division:</label>
      <select id="divDrop" class="form-control" v-model="selectedDivision" :required="true">
        <option v-for="w of divisionNames" v-bind:key="w">{{ w }}</option>
      </select>
      </div>
      <br>
      <div colspan="4" v-for="division in divisions" v-bind:key="division['.key']">
          <div v-if="division['division']['name']==selectedDivision">
          <h4>{{division["division"]["name"]}} Standings</h4>
          <table class="table">
              <thead>
                <tr>
                    <th scope="col">Team</th>
                    <th scope="col">W</th>
                    <th scope="col">L</th>
                    <th scope="col">OT</th>
                    <th scope="col">Points</th>
                    <th scope="col">Current Pace</th>
                </tr>
              </thead>
                <tbody>
                <tr v-for="team in division['teamRecords']" v-bind:key="team['.key']"> 
                    <td scope="row">{{team["team"]["name"]}}</td>
                    <td>{{team["leagueRecord"]["wins"]}}</td>
                    <td>{{team["leagueRecord"]["losses"]}}</td>
                    <td>{{team["leagueRecord"]["ot"]}}</td>
                    <td>{{team["points"]}}</td>
                    <td>{{parseInt(parseFloat(team["pointsPercentage"]) * 56 *2) }}</td>
                </tr>
                </tbody>
            </table> 
          </div>
        </div> 
  </div>
</template>
<script>
 import axios from 'axios';

  export default {
    name: 'Standings',
    data() {
        return {
            divisions: null,
            divisionNames: [],
            selectedDivision: "",
        };
    },
    created: function() {
        console.log("Casey: calling axios")
        const headers = { "Content-Type": "application/json" };
        axios
            .get('https://statsapi.web.nhl.com/api/v1/standings/', { headers })
            .then(res => {
                console.log("Casey: Got the resonse")
                this.divisions = res.data.records

                var div
                for (div in this.divisions) {
                    this.divisionNames.push(this.divisions[div]["division"]["name"])
                }
                console.log(this.divisionNames)
                this.selectedDivision = this.divisionNames[0]
            })
    }
  }
</script>
<style>
    h3 {
        margin-bottom: 5%;
    }
</style>