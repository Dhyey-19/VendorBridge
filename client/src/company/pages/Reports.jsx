import { BarChart3, Download, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import './Reports.css';

function Reports() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-muted text-sm mt-2">Insights into procurement spending and vendor performance.</p>
        </div>
        <button className="btn btn-primary">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card stat-card border-t-4" style={{ borderTopColor: 'var(--primary-color)' }}>
          <div className="stat-info">
            <h3 className="text-sm font-medium text-muted">Total Spend (YTD)</h3>
            <p className="text-2xl font-bold mt-1">$1.2M</p>
            <p className="text-xs text-success mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +12% from last year
            </p>
          </div>
          <div className="stat-icon bg-primary-light text-primary p-3 rounded-full">
            <DollarSign size={24} />
          </div>
        </div>
        
        <div className="card stat-card border-t-4" style={{ borderTopColor: 'var(--secondary-color)' }}>
          <div className="stat-info">
            <h3 className="text-sm font-medium text-muted">Avg. PO Processing Time</h3>
            <p className="text-2xl font-bold mt-1">3.2 Days</p>
            <p className="text-xs text-success mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> -0.5 days from last month
            </p>
          </div>
          <div className="stat-icon bg-success-light text-success p-3 rounded-full">
            <BarChart3 size={24} />
          </div>
        </div>

        <div className="card stat-card border-t-4" style={{ borderTopColor: 'var(--warning-color)' }}>
          <div className="stat-info">
            <h3 className="text-sm font-medium text-muted">Active Vendors</h3>
            <p className="text-2xl font-bold mt-1">142</p>
            <p className="text-xs text-muted mt-2">Across 12 categories</p>
          </div>
          <div className="stat-icon bg-warning-light text-warning p-3 rounded-full">
            <PieChart size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4 text-lg font-bold">Top Vendors by Spend</h3>
          <div className="table-container shadow-none border-none">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Spend</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">TechCorp Solutions</td>
                  <td>$450,000</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-primary-color h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-xs">35%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Global Logistics</td>
                  <td>$280,000</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-primary-color h-2 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      <span className="text-xs">22%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Office Plus</td>
                  <td>$120,000</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-primary-color h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-xs">10%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card flex items-center justify-center bg-gray-50 border-dashed border-2">
          <div className="text-center p-8">
            <BarChart3 size={48} className="mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-muted">Spend by Category Chart</h3>
            <p className="text-sm text-muted mt-2">Chart integration goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
