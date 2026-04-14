import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Slider from '../ui/Slider';

export default function Pattern() {
  const growth = useAppStore((s) => s.growth);
  const spread = useAppStore((s) => s.spread);
  const bloom = useAppStore((s) => s.bloom);
  const count = useAppStore((s) => s.count);
  const sliderMaxes = useAppStore((s) => s.sliderMaxes);
  const setGrowth = useAppStore((s) => s.setGrowth);
  const setSpread = useAppStore((s) => s.setSpread);
  const setBloom = useAppStore((s) => s.setBloom);
  const setCount = useAppStore((s) => s.setCount);
  const setSliderMax = useAppStore((s) => s.setSliderMax);

  return (
    <Section title="Pattern" defaultOpen>
      <Slider
        label="Count"
        value={count}
        min={10}
        max={sliderMaxes.count}
        step={10}
        onChange={setCount}
        decimals={0}
        configurable
        onMaxChange={(v) => setSliderMax('count', v)}
      />
      <Slider
        label="Growth"
        value={growth}
        min={0.5}
        max={sliderMaxes.growth}
        step={0.1}
        onChange={setGrowth}
        configurable
        onMaxChange={(v) => setSliderMax('growth', v)}
      />
      <Slider
        label="Spread"
        value={spread}
        min={0.5}
        max={sliderMaxes.spread}
        step={0.1}
        onChange={setSpread}
        configurable
        onMaxChange={(v) => setSliderMax('spread', v)}
      />
      <Slider
        label="Bloom"
        value={bloom}
        min={0.0}
        max={sliderMaxes.bloom}
        step={0.5}
        onChange={setBloom}
        configurable
        onMaxChange={(v) => setSliderMax('bloom', v)}
      />
    </Section>
  );
}
