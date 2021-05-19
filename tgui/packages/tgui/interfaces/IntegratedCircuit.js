import { useBackend, useLocalState } from '../backend';
import { Box, Stack, Icon, Button, Input, Flex, NumberInput, Dropdown, InfinitePlane } from '../components';
import { Component, createRef } from 'inferno';
import { Window } from '../layouts';

const NULL_REF = "[0x0]";
const SVG_Y_OFFSET = -32;
const SVG_X_CURVE_POINT = 16;

const FUNDAMENTAL_DATA_TYPES = {
  "string": (props, context) => {
    const { name, value, setValue } = props;
    return (
      <Input
        placeholder={name}
        value={value}
        onChange={(e, val) => setValue(val)}
      />
    );
  },
  "number": (props, context) => {
    const { name, value, setValue } = props;
    return (
      <Box onMouseDown={e => e.stopPropagation()}>
        <NumberInput
          value={value || 0}
          minValue={-1000}
          maxValue={1000}
          onChange={(e, val) => setValue(val)}
          unit={name}
        />
      </Box>
    );
  },
};

FUNDAMENTAL_DATA_TYPES["any"] = FUNDAMENTAL_DATA_TYPES["string"];

export class IntegratedCircuit extends Component {
  constructor() {
    super();
    this.state = {
      locations: {},
    }
    this.storePortLocation = this.storePortLocation.bind(this);
  }

  // Helper function to get an element's exact position
  getPosition(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
      xPos += el.offsetLeft;
      yPos += el.offsetTop;
      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos + SVG_Y_OFFSET,
    };
  };

  storePortLocation(port, dom) {
    const { locations } = this.state;

    if (!dom) {
      return;
    }

    const lastPosition = locations[port.ref];
    const position = this.getPosition(dom);

    if (isNaN(position.x) || isNaN(position.y)
      || (lastPosition
      && lastPosition.x === position.x
      && lastPosition.y === position.y)) {
      return;
    }
    locations[port.ref] = position;
    this.setState({ locations: locations });
  }

  render() {
    const { act, data } = useBackend(this.context);
    const { components } = data;
    const { locations } = this.state;

    return (
      <Window
        width={600}
        height={600}
      >
        <Window.Content>
          <InfinitePlane
            width="100%"
            height="100%"
          >
            {components.map((comp, index) => (
              <ObjectComponent
                key={index}
                {...comp}
                index={index+1}
                onPortUpdated={this.storePortLocation}
                onPortLoaded={this.storePortLocation}
              />
            ))}
            <Connections locations={locations} />
          </InfinitePlane>
        </Window.Content>
      </Window>
    );
  }
};

const Connections = (props, context) => {
  const { data } = useBackend(context);
  const { locations } = props;
  const { components } = data;
  const connections = [];

  for (const comp of components) {
    for (const port of comp.input_ports) {
      if (port.connected_to === NULL_REF) continue;
      connections.push({
        color: port.color,
        from: locations[port.connected_to],
        to: locations[port.ref],
      });
    }
  }


  return (
    <svg width="100%" height="100%">
      {connections.map((val, index) => {
        const from = val.from;
        const to = val.to;
        if (!to || !from) {
          return;
        }
        // Starting point
        let path = `M ${from.x} ${from.y}`;
        path += `L ${from.x+SVG_X_CURVE_POINT} ${from.y}`;
        path += `C ${to.x}, ${from.y},`;
        path += `${from.x}, ${to.y},`;
        path += `${to.x-SVG_X_CURVE_POINT}, ${to.y}`;

        path += `L ${to.x} ${to.y}`;
        return (
          <path
            key={index}
            d={path}
            fill="transparent"
            stroke={val.color || "#ff00a8"}
            stroke-width="2px"
          />
        );
      })}
    </svg>
  );
}

export class ObjectComponent extends Component {
  constructor() {
    super();
    this.state = {
      isDragging: false,
      dragPos: null,
      lastMousePos: null,
    };

    this.startDrag = (e) => {
      const { x, y } = this.props;
      e.stopPropagation();
      this.setState({
        lastMousePos: null,
        isDragging: true,
        dragPos: { x: x, y: y },
      });
      window.addEventListener('mousemove', this.doDrag);
      window.addEventListener('mouseup', this.stopDrag);
    };

    this.stopDrag = (e) => {
      const { act } = useBackend(this.context);
      const { dragPos } = this.state;
      const { index } = this.props;
      if (dragPos) {
        act("set_component_coordinates", {
          component_id: index,
          rel_x: dragPos.x,
          rel_y: dragPos.y,
        });
      }

      window.removeEventListener('mousemove', this.doDrag);
      window.removeEventListener('mouseup', this.stopDrag);
      this.setState({ isDragging: false });
    };

    this.doDrag = (e) => {
      const { dragPos, isDragging, lastMousePos } = this.state;
      if (dragPos && isDragging) {
        e.preventDefault();
        const { screenZoomX, screenZoomY, screenX, screenY } = e;
        let xPos = screenZoomX || screenX;
        let yPos = screenZoomY || screenY;
        if (lastMousePos) {
          this.setState({
            dragPos: {
              x: dragPos.x - (lastMousePos.x - xPos),
              y: dragPos.y - (lastMousePos.y - yPos),
            },
          });
        }
        this.setState({
          lastMousePos: { x: xPos, y: yPos },
        });
      }
    };
  }

  /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */
  shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }

    return true;
  }

  shallowCompare(nextProps, nextState) {
    return (
      !this.shallowEqual(this.props, nextProps) ||
      !this.shallowEqual(this.state, nextState)
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.shallowCompare(nextProps, nextState)
  }

  render() {
    const {
      input_ports,
      output_ports,
      name,
      x,
      y,
      index,
      color = "blue",
      options,
      option,
      removable,
      locations,
      onPortUpdated,
      onPortLoaded,
      ...rest
    } = this.props;
    const { act } = useBackend(this.context);
    const { dragPos } = this.state;

    let [x_pos, y_pos] = [x, y];
    if (dragPos) {
      x_pos = dragPos.x;
      y_pos = dragPos.y;
    }

    return (
      <Box
        {...rest}
        position="absolute"
        left={`${x_pos}px`}
        top={`${y_pos}px`}
        onMouseDown={(e) => this.startDrag(e)}
        onMouseUp={(e) => this.stopDrag(e, index)}
        onComponentWillUnmount={(e) => this.stopDrag(e, index)}
      >
        <Box
          backgroundColor={color}
          py={1}
          px={1}
          className="ObjectComponent__Titlebar"
        >
          <Stack>
            <Stack.Item grow={1} unselectable="on">
              {name}
            </Stack.Item>
            {!!options && (
              <Stack.Item>
                <Dropdown
                  color={color}
                  nochevron
                  over
                  options={options}
                  displayText={`Option: ${option}`}
                  noscroll
                  onSelected={selected => act("set_component_option", {
                    component_id: index,
                    option: selected,
                  })}
                />
              </Stack.Item>
            )}
            {!!removable && (
              <Stack.Item>
                <Button
                  color="transparent"
                  icon="times"
                  compact
                  onClick={() => act("detach_component", { component_id: index })}
                />
              </Stack.Item>
            )}
          </Stack>
        </Box>
        <Box
          className="ObjectComponent__Content"
          unselectable="on"
          py={1}
          px={1}
        >
          <Stack>
            <Stack.Item grow={1}>
              <Stack vertical fill>
                {input_ports.map((port, portIndex) => (
                  <Stack.Item key={portIndex}>
                    <Port
                      port={port}
                      portIndex={portIndex+1}
                      componentId={index}
                      onPortLoaded={onPortLoaded}
                      onPortUpdated={onPortUpdated}
                    />
                  </Stack.Item>
                ))}
              </Stack>
            </Stack.Item>
            <Stack.Item ml={5}>
              <Stack vertical>
                {output_ports.map((port, portIndex) => (
                  <Stack.Item key={portIndex}>
                    <Port
                      port={port}
                      portIndex={portIndex+1}
                      componentId={index}
                      onPortLoaded={onPortLoaded}
                      onPortUpdated={onPortUpdated}
                      isOutput
                    />
                  </Stack.Item>
                ))}
              </Stack>
            </Stack.Item>
          </Stack>
        </Box>
      </Box>
    );
  }
}

export class Port extends Component {
  constructor(props, context) {
    super(props, context);
    this.iconRef = createRef();

    this.handlePortClick = () => {
      const { act } = useBackend(this.context);
      const [selectedPort, setSelectedPort]
        = useLocalState(context, "selected_port", null);

      const {
        port,
        portIndex,
        componentId,
        isOutput,
        ...rest
      } = props;

      if (selectedPort) {
        if (selectedPort.ref === port.ref) {
          setSelectedPort(null);
          return;
        } else if (selectedPort.component_id !== componentId) {
          if (selectedPort.is_output === isOutput) {
            setSelectedPort(null);
            return;
          }
          let data;
          if (isOutput) {
            data = {
              input_port_id: selectedPort.index,
              output_port_id: portIndex,
              input_component_id: selectedPort.component_id,
              output_component_id: componentId,
            };
          } else {
            data = {
              input_port_id: portIndex,
              output_port_id: selectedPort.index,
              input_component_id: componentId,
              output_component_id: selectedPort.component_id,
            };
          }
          act("add_connection", data);
          setSelectedPort(null);
          return;
        }
      }
      setSelectedPort({
        index: portIndex,
        component_id: componentId,
        is_output: isOutput,
        ref: port.ref,
      });

    };

    this.handlePortRightClick = (e) => {
      const { act } = useBackend(this.context);
      const [selectedPort, setSelectedPort]
        = useLocalState(context, "selected_port", null);

      const {
        port,
        portIndex,
        componentId,
        isOutput,
        ...rest
      } = props;

      e.preventDefault();
      act("remove_connection", {
        component_id: componentId,
        is_input: !isOutput,
        port_id: portIndex,
      });
    };

    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidUpdate() {
    const { port, onPortUpdated } = this.props;
    if (onPortUpdated) {
      onPortUpdated(port, this.iconRef.current);
    }
  }

  componentDidMount() {
    const { port, onPortLoaded } = this.props;
    if (onPortLoaded) {
      onPortLoaded(port, this.iconRef.current);
    }
  }

  render() {
    const {
      port,
      portIndex,
      componentId,
      isOutput,
      ...rest
    } = this.props;

    const [selectedPort, setSelectedPort]
      = useLocalState(this.context, "selected_port", null);

    return (
      <Stack {...rest}>
        {!!isOutput && (
          <Stack.Item>
            <DisplayName
              port={port}
              isOutput={isOutput}
              componentId={componentId}
              portIndex={portIndex}
            />
          </Stack.Item>
        )}
        <Stack.Item>
          <Icon
            color={port.color || "blue"}
            name={selectedPort && selectedPort.ref === port.ref
              ? "dot-circle" : "circle"}
            position="relative"
            onClick={(e) => this.handlePortClick(e)}
            onContextMenu={(e) => this.handlePortRightClick(e)}
          >
            <span
              ref={this.iconRef}
              className="ObjectComponent__PortPos"
            />
          </Icon>
        </Stack.Item>
        {!isOutput && (
          <Stack.Item>
            <DisplayName
              port={port}
              isOutput={isOutput}
              componentId={componentId}
              portIndex={portIndex}
            />
          </Stack.Item>
        )}
      </Stack>
    );
  }
}

const DisplayName = (props, context) => {
  const { act } = useBackend(context);
  const {
    port,
    isOutput,
    componentId,
    portIndex,
    ...rest
  } = props;

  const InputComponent = FUNDAMENTAL_DATA_TYPES[port.type || 'any'];

  const isInput = !isOutput
    && port.connected_to === NULL_REF
    && InputComponent;

  return (
    <Box {...rest}>
      <Flex direction="column">
        <Flex.Item>
          {isInput && (
            <InputComponent
              setValue={val => act("set_component_input", {
                component_id: componentId,
                port_id: portIndex,
                input: val,
              })}
              name={port.name}
              value={port.current_data}
            />
          ) || port.name}
        </Flex.Item>
        <Flex.Item>
          <Box
            fontSize={0.75}
            opacity={0.25}
          >
            {port.type || "any"}
          </Box>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
