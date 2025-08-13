// customSeriesGenerator.test.ts
import { customSeriesGenerator } from './customSeriesGenerator';

describe('customSeriesGenerator', () => {
  let mockDestroy: jest.Mock;
  let mockAdd: jest.Mock;
  let mockPath: jest.Mock;
  let mockChart: any;

  beforeEach(() => {
    mockDestroy = jest.fn();
    mockAdd = jest.fn().mockReturnValue({}); // simulate Highcharts add
    mockPath = jest.fn().mockReturnValue({
      attr: jest.fn().mockReturnValue({ add: mockAdd }),
    });

    mockChart = {
      renderer: {
        path: mockPath,
      },
      series: [
        {
          points: [
            {
              visible: true,
              plotX: 50,
              plotY: 60,
              options: { isParent: false },
              shapeArgs: { width: 70, height: 25 },
              color: '#123456',
            },
            {
              visible: false,
              plotX: 100,
              plotY: 200,
              options: { isParent: false },
              shapeArgs: { width: 70, height: 25 },
              color: '#654321',
            },
          ],
        },
      ],
      plotTop: 10,
      plotLeft: 5,
    };
  });

  it('should destroy existing arrows before drawing new ones', () => {
    const existingArrow = { destroy: mockDestroy };
    const chartArrowsMap: any = new WeakMap();
    chartArrowsMap.set(mockChart, [existingArrow]);
    (global as any).chartArrowsMap = chartArrowsMap;

    customSeriesGenerator(mockChart);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('should create arrows for visible points only', () => {
    (global as any).chartArrowsMap = new WeakMap();

    customSeriesGenerator(mockChart);

    expect(mockPath).toHaveBeenCalledTimes(1); // only visible point triggers arrow
    expect(mockPath).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should set arrow attributes with correct fill color', () => {
    (global as any).chartArrowsMap = new WeakMap();

    customSeriesGenerator(mockChart);

    const pathArgs = mockPath.mock.calls[0][0];
    expect(Array.isArray(pathArgs)).toBe(true);

    const attrArgs = mockPath.mock.results[0].value.attr.mock.calls[0][0];
    expect(attrArgs.fill).toBe('#123456');
    expect(attrArgs.opacity).toBe(1);
    expect(attrArgs.stroke).toBe('#000');
    expect(attrArgs['stroke-width']).toBe(1);
  });

  it('should update chartArrowsMap with newly created arrows', () => {
    (global as any).chartArrowsMap = new WeakMap();

    customSeriesGenerator(mockChart);

    const arrowsInMap = (global as any).chartArrowsMap.get(mockChart);
    expect(arrowsInMap.length).toBe(1);
  });

  it('should not create arrows if all points are invisible', () => {
    mockChart.series[0].points.forEach((p: any) => (p.visible = false));
    (global as any).chartArrowsMap = new WeakMap();

    customSeriesGenerator(mockChart);

    expect(mockPath).not.toHaveBeenCalled();
  });
});
