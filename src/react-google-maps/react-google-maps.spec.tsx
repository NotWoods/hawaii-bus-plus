import test from 'ava';
import React, { useContext } from 'react';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MapProvider, MapSetterContext } from './MapProvider.js';
import { useGoogleMap } from './hooks.js';

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
