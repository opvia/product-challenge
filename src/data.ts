export interface Field {
  name: string;
  type: 'number' | 'string' | 'date';
  value: any;
}

export interface BioreactorBlob {
  id: string;
  fields: Field[];
}

export const viewContext = {
  runId: 'run-81b',
  filter: `runId = run-81b`
};

export const columnsForThisRun = ['runId', 'time', 'Cell Density', 'Volume'];

// realistic-ish bioreactor growth: logistic curve for density, slow ramp for volume
const maxDensity = 12; // 10^6 cells / mL
const k = 0.3; // growth rate constant
const initialVolume = 100; // mL
const feedRate = 1.2; // mL per step

export const entitiesFromView: BioreactorBlob[] = Array.from({ length: 1000 }, (_, i) => {
  const time = i; // e.g. minutes or arbitrary unit
  // logistic growth + small noise
  const density = maxDensity / (1 + Math.exp(-k * (time - 30))) * (1 + (Math.random() - 0.5) * 0.02);
  const volume = initialVolume + feedRate * time * (1 + (Math.random() - 0.5) * 0.005);
  return {
    id: `row-${i}`,
    fields: [
      { name: 'runId', type: 'string', value: 'run-81b' },
      { name: 'time', type: 'number', value: time },
      { name: 'Cell Density', type: 'number', value: density },
      { name: 'Volume', type: 'number', value: volume },
    ],
  };
});