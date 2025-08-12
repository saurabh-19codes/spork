// AcdAptEpicCharts.spec.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AcdAptEpicCharts from './AcdAptEpicCharts';
import { withRouter } from '@americanexpress/one-app-router';

// Mock router and buildUrl
jest.mock('@americanexpress/one-app-router', () => ({
  withRouter: (Comp) => (props) => <Comp {...props} router={{ push: jest.fn() }} />,
}));
jest.mock('../constants', () => ({
  buildUrl: jest.fn((path) => `/mock-base${path}`),
}));

const mockRouter = { push: jest.fn() };
const mockOrgName = 'TestOrg';
const mockDataByEpics = {
  Epic1: [
    {
      epicName: 'Epic One',
      data7: {
        beingGroomed: 5,
        beingWorked: 3,
        finalized: 2,
        sayDoRatio: 0.5,
      },
    },
  ],
};

describe('AcdAptEpicCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart with correct labels', () => {
    render(<AcdAptEpicCharts router={mockRouter} dataByEpics={mockDataByEpics} orgName={mockOrgName} />);

    // Check category label
    expect(screen.getByTestId('dataEpic')).toBeInTheDocument();
    expect(screen.getByText('Being Groomed')).toBeInTheDocument();
    expect(screen.getByText('Being Worked')).toBeInTheDocument();
    expect(screen.getByText('Finalized')).toBeInTheDocument();
  });

  it('calls router.push when clicking "Being Groomed"', () => {
    render(<AcdAptEpicCharts router={mockRouter} dataByEpics={mockDataByEpics} orgName={mockOrgName} />);

    const groomedElement = screen.getByText('Being Groomed');
    fireEvent.click(groomedElement);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/program-dashboard/'));
  });

  it('calls router.push when clicking "Being Worked"', () => {
    render(<AcdAptEpicCharts router={mockRouter} dataByEpics={mockDataByEpics} orgName={mockOrgName} />);

    const workedElement = screen.getByText('Being Worked');
    fireEvent.click(workedElement);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });

  it('calls router.push when clicking "Finalized"', () => {
    render(<AcdAptEpicCharts router={mockRouter} dataByEpics={mockDataByEpics} orgName={mockOrgName} />);

    const finalizedElement = screen.getByText('Finalized');
    fireEvent.click(finalizedElement);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });

  it('handles empty data without crashing', () => {
    render(<AcdAptEpicCharts router={mockRouter} dataByEpics={{}} orgName={mockOrgName} />);

    expect(screen.getByTestId('dataEpic')).toBeInTheDocument();
  });
});
