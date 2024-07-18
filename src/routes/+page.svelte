<script lang="ts">
	let power: 'on' | 'off' = 'off';
	let mode: 'cool' | 'heat' | 'vent' | 'dry' | undefined;
	let speed: 'low' | 'medium' | 'high' | 'auto' | undefined;
	let temp: number | undefined;

	const switch_ = () => {
		if ((power = power === 'off' ? 'on' : 'off') === 'on') {
			mode = mode || 'cool';
			speed = speed || 'auto';
			temp = temp || 23;
		}
	};

	const cycle = <T>(arr: T[], current: T): T => arr[(arr.indexOf(current) + 1) % arr.length];

	const mode_ = () => mode = power === 'on' ? cycle(['cool', 'heat', 'vent', 'dry'], mode || 'dry') : mode;
	const speed_ = () => speed = power === 'on' ?  cycle(['low', 'medium', 'high', 'auto'], speed || 'auto') : speed;

	const temp_up_ = () => temp = power === 'on' ?  Math.min((temp || 23) + 1, 30) : temp;
	const temp_down_ = () => temp = power === 'on' ?  Math.max((temp || 23) - 1, 15) : temp;
</script>

{power}
{power === 'on' ? mode : ''}
{power === 'on' ? speed : ''}
{power === 'on' ? `${temp}c` : ''}

<button on:click={switch_}>ON/OFF</button>
<button on:click={mode_}>MODE</button>
<button on:click={speed_}>FAN SPEED</button>
<button on:click={temp_up_}>UP</button>
<button on:click={temp_down_}>DOWN</button>
