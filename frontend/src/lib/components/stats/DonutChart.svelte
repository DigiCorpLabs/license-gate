<script>
  import {Doughnut} from 'svelte-chartjs';
  import {donutData} from './donutData.js';

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<div style="height: 400px">
    <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false }}/>
</div>
