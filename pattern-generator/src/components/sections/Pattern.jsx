import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Slider from '../ui/Slider';

export default function Pattern() {
  const growth = useAppStore((s) => s.growth);
  const spread = useAppStore((s) => s.spread);
  const bloom = useAppStore((s) => s.bloom);
  const count = useAppStore((s) => s.count);
  const setGrowth = useAppStore((s) => s.setGrowth);
  const setSpread = useAppStore((s) => s.setSpread);
  const setBloom = useAppStore((s) => s.setBloom);
  const setCount = useAppStore((s) => s.setCount);

  return (
    <Section title="Pattern" defaultOpen>
      <Slider
        label="Count"
        value={count}
        min={10}
        max={6000}
        step={10}
        onChange={setCount}
        decimals={0}
      />
      <Slider
        label="Growth"
        value={growth}
        min={0.5}
        max={15.0}
        step={0.1}
        onChange={setGrowth}
        onAnimateToggle={() => {}}
      />
      <Slider
        label="Spread"
        value={spread}
        min={0.5}
        max={100.0}
        step={0.1}
        onChange={setSpread}
        onAnimateToggle={() => {}}
      />
      <Slider
        label="Bloom"
        value={bloom}
        min={0.0}
        max={360.0}
        step={0.5}
        onChange={setBloom}
        onAnimateToggle={() => {}}
      />
    </Section>
  );
}
