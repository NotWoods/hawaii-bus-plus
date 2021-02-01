import test from 'ava';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { useGoogleMap } from '../src/hooks.js';
import { MapProvider, MapSetterContext } from '../src/MapProvider.js';

const { shallow, configure } = enzyme;

test.before(() => {
  configure({ adapter: new Adapter() });
});

function TestComponent() {
  const map = useGoogleMap();
  const setMap = useContext(MapSetterContext);

  return (
    <>
      <div className="map">{map}</div>
      <div className="setMap">{setMap}</div>
    </>
  );
}

test('MapProvider creates setMap & empty map', (t) => {
  const wrapper = shallow(
    <MapProvider>
      <TestComponent />
    </MapProvider>
  )
    .find(TestComponent)
    .dive();

  t.is(wrapper.find('.map').children().length, 0);
  t.is(wrapper.find('.setMap').children().length, 1);
});
