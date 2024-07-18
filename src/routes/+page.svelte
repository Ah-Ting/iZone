<script lang="ts">
	import { onMount } from 'svelte';
	export let data: any;

	type Mode = 'cool' | 'heat' | 'vent' | 'dry';
	type Speed = 'low' | 'medium' | 'high' | 'auto';

	const modes: Mode[] = ['cool', 'heat', 'vent', 'dry'];
	const speeds: Speed[] = ['low', 'medium', 'high', 'auto'];

	let power: 'on' | 'off';
	let mode: Mode;
	let speed: Speed;
	let temp: number;

	const control_ac_ = async (query: Object) => {
		try {
			await fetch('https://api.izone.com.au/testsimplelocalcocb', {
				method: 'POST',
				mode: 'no-cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(query)
			});
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const switch_ = async () => {
		power = power === 'off' ? 'on' : 'off';
		await control_ac_({ SysOn: power === 'on' ? 1 : 0 });
	};

	const cycle_ = <T,>(arr: T[], current: T): T => arr[(arr.indexOf(current) + 1) % arr.length];

	const mode_ = async () => {
		if (power === 'on') {
			mode = cycle_(modes, mode);
			await control_ac_({ SysMode: modes.indexOf(mode) + 1 });
		}
	};

	const speed_ = async () => {
		if (power === 'on') {
			speed = cycle_(speeds, speed);
			await control_ac_({ SysFan: speeds.indexOf(speed) + 1 });
		}
	};

	const adjust_temp_ = async (change: number) => {
		if (power === 'on') {
			temp = Math.max(15, Math.min(30, temp + change));
			await control_ac_({ SysSetpoint: temp * 100 });
		}
	};

	const temp_up_ = async () => adjust_temp_(1);
	const temp_down_ = async () => adjust_temp_(-1);

	onMount(() => {
		power = data.ac.SysOn === 0 ? 'off' : 'on';
		mode = modes[data.ac.SysMode - 1];
		speed = speeds[data.ac.SysFan - 1];
		temp = data.ac.Setpoint / 100;
	});
</script>

<main>
	<div class="screen">
		<p class="power-status">{power === 'on' ? 'Power ON' : 'Power OFF'}</p>
		<div class="state-box">
			{#if power === 'on'}
				<p class="state-item">Mode: {mode}</p>
				<p class="state-item">Speed: {speed}</p>
				<p class="state-item">Temperature: {temp}°C</p>
			{/if}
		</div>
	</div>

	<div class="remote">
		<button on:click={switch_}><span class="icon">🔌</span>On/Off</button>
		<button on:click={mode_}><span class="icon">🌡️</span>Mode</button>
		<button on:click={speed_}><span class="icon">🌀</span>Fan Speed</button>
		<div class="temp-buttons">
			<button class="triangle-up" on:click={temp_up_}><span class="icon">▲</span></button>
			<button class="triangle-down" on:click={temp_down_}><span class="icon">▼</span></button>
		</div>
	</div>
</main>

<style>
	:global(body) {
		font-family: Arial, sans-serif;
		background-color: #bfebfe;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}

	main {
		background-color: #4fd2fa;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 20px;
		max-width: 300px;
		width: 100%;
		text-align: center;
	}

	p {
		font-size: 1em;
		margin: 5px 0;
	}

	button {
		background-color: #006cfa;
		border: none;
		border-radius: 100px;
		color: rgb(238, 238, 238);
		padding: 10px 10px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 1em;
		margin: 5px 2px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #023492;
	}

	.remote {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(2, 1fr);
	}

	.screen {
		margin-bottom: 20px;
		padding: 10px;
		background-color: #a8efff;
		border-radius: 5px;
	}

	.power-status {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.state-box {
		padding: 10px;
		background-color: #cdf8ff;
		border: 1px solid #9ae6ff;
		border-radius: 5px;
		min-height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.state-item {
		height: 20px;
	}

	.icon {
		display: inline-block;
	}

	.temp-buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.triangle-up,
	.triangle-down {
		width: 0;
		height: 10;
		border-left: 15px solid transparent;
		border-right: 15px solid transparent;
		cursor: pointer;
		justify-content: center;
		align-items: center;
		display: flex;
		border-radius: 5px;
		font-size: 1.5em;
	}

	.triangle-up {
		border-bottom: 10px solid #007bff;
	}

	.triangle-up:hover {
		border-bottom: 10px solid #0056b3;
	}

	.triangle-down {
		border-top: 10px solid #007bff;
	}

	.triangle-down:hover {
		border-top: 10px solid #0056b3;
	}
</style>
