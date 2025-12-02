import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Spinner, Alert, Card as BSCard } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminPharmacistSidebar from './AdminPharmacistSidebar';
import AdminPharmacistHeader from './AdminPharmacistHeader';
import Icon from '../common/Icons';
import StockService from '../../services/stockService';
import OrderService from '../../services/orderService';
import DistributionService from '../../services/distributionService';
import PrescriptionService from '../../services/prescriptionService';
import MedicationService from '../../services/medicationService';
import SiteService from '../../services/siteService';
import StockMovementService from '../../services/stockMovementService';
import './AdminPharmacistDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const AdminPharmacistDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    stock: null,
    orders: null,
    distributions: null,
    prescriptions: null,
    medications: null,
    sites: null,
    alerts: null,
    recentMovements: null
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        stockSummary,
        orderStats,
        distributionStats,
        prescriptionStats,
        medicationStats,
        sitesData,
        stockAlerts,
        recentMovements
      ] = await Promise.allSettled([
        StockService.getStockSummary(),
        OrderService.getOrderStatistics(),
        DistributionService.getDistributionStatistics(),
        PrescriptionService.getPrescriptionStats(),
        MedicationService.getStatistics(),
        SiteService.getAllSites({ active_only: true }),
        StockService.getStockAlerts({ limit: 10 }),
        StockMovementService.getRecentMovements(5)
      ]);

      setStats({
        stock: stockSummary.status === 'fulfilled' ? stockSummary.value?.data : null,
        orders: orderStats.status === 'fulfilled' ? orderStats.value?.data : null,
        distributions: distributionStats.status === 'fulfilled' ? distributionStats.value?.data : null,
        prescriptions: prescriptionStats.status === 'fulfilled' ? prescriptionStats.value?.data : null,
        medications: medicationStats.status === 'fulfilled' ? medicationStats.value?.data : null,
        sites: sitesData.status === 'fulfilled' ? sitesData.value?.data : null,
        alerts: stockAlerts.status === 'fulfilled' ? stockAlerts.value?.data : null,
        recentMovements: recentMovements.status === 'fulfilled' ? recentMovements.value : null
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getAlertCount = () => {
    if (!stats.alerts) return 0;
    return Array.isArray(stats.alerts) ? stats.alerts.length : 0;
  };

  // Chart Data
  const stockChartData = {
    labels: ['En stock', 'Stock faible', 'Rupture'],
    datasets: [
      {
        label: 'Distribution des stocks',
        data: [70, 20, 10],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderColor: ['#1e7e34', '#e0a800', '#c82333'],
        borderWidth: 2,
      },
    ],
  };

  const ordersChartData = {
    labels: ['Complet', 'En attente', 'Annulé'],
    datasets: [
      {
        label: 'Statut des commandes',
        data: [stats.orders?.completed_count || 0, stats.orders?.pending_count || 0, stats.orders?.cancelled_count || 0],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderColor: ['#1e7e34', '#e0a800', '#c82333'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, weight: '600' },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
      },
    },
  };

  return (
    <div className="admin-pharmacist-dashboard modern-dashboard">
      <AdminPharmacistSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AdminPharmacistHeader 
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <Container fluid className="dashboard-container py-4">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">Chargement des données...</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <Row className="mb-5">
                <Col>
                  <div className="dashboard-header">
                    <div>
                      <h1 className="dashboard-title">Tableau de bord Pharmacie</h1>
                      <p className="dashboard-subtitle">Vue d'ensemble en temps réel de vos opérations</p>
                    </div>
                    <button 
                      className="btn btn-refresh"
                      onClick={loadDashboardData}
                    >
                      <Icon name="refresh" size={16} className="me-2" />
                      Actualiser
                    </button>
                  </div>
                </Col>
              </Row>

              {/* KPI Cards */}
              <Row className="g-4 mb-5">
                <Col xs={12} sm={6} lg={3}>
                  <div className="kpi-card kpi-green">
                    <div className="kpi-icon">
                      <Icon name="database" size={32} />
                    </div>
                    <div className="kpi-content">
                      <p className="kpi-label">Stock Total</p>
                      <h2 className="kpi-value">{formatNumber(stats.stock?.total_quantity || 0)}</h2>
                      <p className="kpi-meta">{formatNumber(stats.stock?.total_medications || 0)} articles</p>
                    </div>
                  </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <div className="kpi-card kpi-blue">
                    <div className="kpi-icon">
                      <Icon name="shopping-cart" size={32} />
                    </div>
                    <div className="kpi-content">
                      <p className="kpi-label">Commandes</p>
                      <h2 className="kpi-value">{formatNumber(stats.orders?.total_count || 0)}</h2>
                      <p className="kpi-meta">{stats.orders?.pending_count || 0} en attente</p>
                    </div>
                  </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <div className="kpi-card kpi-yellow">
                    <div className="kpi-icon">
                      <Icon name="truck" size={32} />
                    </div>
                    <div className="kpi-content">
                      <p className="kpi-label">Distributions</p>
                      <h2 className="kpi-value">{formatNumber(stats.distributions?.total_count || 0)}</h2>
                      <p className="kpi-meta">{stats.distributions?.pending_count || 0} en attente</p>
                    </div>
                  </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <div className="kpi-card kpi-red">
                    <div className="kpi-icon">
                      <Icon name="exclamation-triangle" size={32} />
                    </div>
                    <div className="kpi-content">
                      <p className="kpi-label">Alertes</p>
                      <h2 className="kpi-value">{getAlertCount()}</h2>
                      <p className="kpi-meta">signalées</p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Charts Row */}
              <Row className="g-4 mb-5">
                <Col lg={6}>
                  <BSCard className="chart-card border-0 shadow-sm">
                    <BSCard.Body className="p-4">
                      <h5 className="chart-title mb-4">
                        <Icon name="chart-pie" size={18} className="me-2" />
                        Distribution des Stocks
                      </h5>
                      <div style={{ height: '300px', position: 'relative' }}>
                        <Doughnut data={stockChartData} options={chartOptions} />
                      </div>
                    </BSCard.Body>
                  </BSCard>
                </Col>

                <Col lg={6}>
                  <BSCard className="chart-card border-0 shadow-sm">
                    <BSCard.Body className="p-4">
                      <h5 className="chart-title mb-4">
                        <Icon name="chart-bar" size={18} className="me-2" />
                        État des Commandes
                      </h5>
                      <div style={{ height: '300px', position: 'relative' }}>
                        <Pie data={ordersChartData} options={chartOptions} />
                      </div>
                    </BSCard.Body>
                  </BSCard>
                </Col>
              </Row>

              {/* Secondary Stats */}
              <Row className="g-4 mb-5">
                <Col xs={12} sm={6} lg={3}>
                  <div className="stat-box">
                    <div className="stat-icon stat-icon-primary">
                      <Icon name="pills" size={24} />
                    </div>
                    <h6 className="stat-title">Médicaments</h6>
                    <p className="stat-value">{formatNumber(stats.medications?.total_count || 0)}</p>
                  </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <div className="stat-box">
                    <div className="stat-icon stat-icon-success">
                      <Icon name="building" size={24} />
                    </div>
                    <h6 className="stat-title">Sites Actifs</h6>
                    <p className="stat-value">{formatNumber(stats.sites?.length || 0)}</p>
                  </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <div className="stat-box">
                    <div className="stat-icon stat-icon-info">
                      <Icon name="exchange-alt" size={24} />
                    </div>
                    <h6 className="stat-title">Mouvements</h6>
                    <p className="stat-value">{formatNumber(stats.recentMovements?.length || 0)}</p>
                  </div>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Row className="g-4">
                <Col>
                  <h5 className="section-title mb-4">
                    <Icon name="zap" size={18} className="me-2" />
                    Accès Rapide
                  </h5>
                </Col>
              </Row>
              
              <Row className="g-4">
                <Col md={6} lg={4}>
                  <div className="action-card action-card-success" onClick={() => navigate('/admin-pharmacist/global-stock')}>
                    <Icon name="database" size={32} />
                    <h6>Gestion des Stocks</h6>
                    <p>Inventaire global</p>
                  </div>
                </Col>

                <Col md={6} lg={4}>
                  <div className="action-card action-card-info" onClick={() => navigate('/admin-pharmacist/stock-movements')}>
                    <Icon name="exchange-alt" size={32} />
                    <h6>Mouvements</h6>
                    <p>Historique détaillé</p>
                  </div>
                </Col>

                <Col md={6} lg={4}>
                  <div className="action-card action-card-warning" onClick={() => navigate('/admin-pharmacist/orders')}>
                    <Icon name="shopping-cart" size={32} />
                    <h6>Commandes</h6>
                    <p>Gestion des commandes</p>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default AdminPharmacistDashboard;
