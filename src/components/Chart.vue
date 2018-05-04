
    <div id="Chart">
        <div class="container">
          <div class="Chart__list">
            <div class="Chart">
              <h2>Chart</h2>
            </div>
          </div>
        </div>
      </div>


<script>
    import { Doughnut, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins
    
      export default {
        name: 'Chart',
        extends: Doughnut,
        mixins: [reactiveProp],
        props: ['chartData', 'options'],
        mounted() { 
          this.renderChart(this.chartData, this.options)
        }
        
      }
    
</script>

<style scoped>
   #doughnut-chart{
       width:50% !important;
       height: 50% !important;
       display: inline !important;
   }
</style>