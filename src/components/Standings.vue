<template>
  <div class="container">
    <h3>NHL Division Standings</h3>
      <div>
          <label for="divDrop">Select Division:</label>
          <select id="divDrop" class="form-control" v-model="selectedDivision" :required="true">
            <option v-for="w of divisionNames" v-bind:key="w">{{ w }}</option>
          </select>
      </div>
      <br>
      <div>
          <label for="chaseDrop">Select Chasing Team:</label>
          <select id="chaseDrop" class="form-control" v-model="chaserTeamName" :required="true">
            <option v-for="t of selectedTeams" v-bind:key="t['.key']">{{ t["team"]["name"] }}</option>
          </select>
      </div>
      <br>
      <div colspan="4">
          <div v-if="selectedDivision != null">
          <h4>{{ selectedDivision }} Standings</h4>
          <table class="table">
              <thead>
                <tr>
                    <th scope="col">Team</th>
                    <th scope="col">W</th>
                    <th scope="col">L</th>
                    <th scope="col">OT</th>
                    <th scope="col">Points</th>
                    <th scope="col">Points Pace</th>
                    <th scope="col">Games Left</th>
                    <th scope="col" v-if="chaserTeamName != 'null'">Record To Match Pace</th>
                </tr>
              </thead>
                <tbody>
                <tr v-for="team in selectedTeams" v-bind:key="team['.key']"> 
                    <td scope="row">{{team["team"]["name"]}}</td>
                    <td>{{team["leagueRecord"]["wins"]}}</td>
                    <td>{{team["leagueRecord"]["losses"]}}</td>
                    <td>{{team["leagueRecord"]["ot"]}}</td>
                    <td>{{team["points"]}}</td>
                    <td>{{parseInt(estimatedPointsPace(parseFloat(team["pointsPercentage"]))) }}</td>
                    <td>{{numGamesSeason - parseInt(team["gamesPlayed"]) }}</td>
                    <td v-if="chaserTeamName != 'null'">{{ recordNeeded(team["team"]["name"], team["pointsPercentage"]) }}</td>
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
            selectedDivision: null,
            chaserTeamName: "Dallas Stars",
            numGamesSeason: 56
        };
    },
    created: function() {
        console.log("Calling axios")
        const headers = { "Content-Type": "application/json" };
        axios
            .get('https://statsapi.web.nhl.com/api/v1/standings/', { headers })
            .then(res => {
                this.divisions = res.data.records

                var div
                for (div in this.divisions) {
                    this.divisionNames.push(this.divisions[div]["division"]["name"])
                }
                console.log(this.divisionNames)
                this.selectedDivision = this.divisionNames[1]
                console.log("selected division: "+this.selectedDivision)
            })
    },
    computed: {
        selectedTeams() {
            let teams = []
            if (this.divisions && this.selectedDivision) {
                const selectedDiv = this.selectedDivision
                this.divisions.forEach( function(division) {
                    if (division['division']['name'] == selectedDiv) {
                        console.log("Found correct division")
                        teams = division['teamRecords']
                    }
                })
            }
            return teams
        },
    },
    methods : {
        estimatedPointsPace(pointsPercentage){
            return this.numGamesSeason * 2 * pointsPercentage
        },
        recordNeeded(teamName, pointsPercentage){
            const teamNameCheck = this.chaserTeamName
            const totalGames = this.numGamesSeason
            let chaserGames = 0
            let chaserPoints = 0

            if (this.chaserTeamName == null || teamName == teamNameCheck) {
                return ""
            }

            this.selectedTeams.forEach(function (t) {
                if (t["team"]["name"] == teamNameCheck) {
                    chaserGames = totalGames - t["gamesPlayed"]
                    chaserPoints = t["points"]
                }
            })

            let pointsNeeded = parseInt(this.estimatedPointsPace(pointsPercentage) - chaserPoints)
            if (pointsNeeded <= 0) {
                return "---"
            }

            let winsNeeded = Math.floor(pointsNeeded / 2)
            var tiesNeeded = 0
            if (pointsNeeded % 2 > 0)
                tiesNeeded = 1

            let maxLosses = chaserGames - winsNeeded - tiesNeeded
            if (maxLosses < 0) {
                return "---"
            }
            return winsNeeded+"-"+maxLosses+"-"+tiesNeeded
        },
    }
  }
</script>
<style>
    h3 {
        margin-bottom: 5%;
    }
</style>