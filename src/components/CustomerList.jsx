import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import { FaTable } from 'react-icons/fa';
import { Grid2x2, FileChartColumn, CloudDownload } from 'lucide-react';
import PageHeader from './shared/PageHeader';
import { Button, buttonVariants } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog';
import { cn } from '../lib/utils';
import CustomerTableView from './CustomerTableView';
import CustomerCardView from './CustomerCardView';
import CustomerFilters from './CustomerFilters';
import CustomerUpload from './CustomerUpload';


const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ mobileNumbers: '', agentId: '', customerName: '' });

  const [viewMode, setViewMode] = useState('card');
  const [totalCustomers, setTotalCustomers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, [currentPage, filters, user.role]);

  const fetchCustomers = async () => {
    const params = { page: currentPage, ...filters };
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customers`, { params });
    setCustomers(res.data.customers);
    setTotalPages(res.data.totalPages);
    setTotalCustomers(res.data.totalCount);
  };

  const fetchAgents = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/agents`);
    setAgents(res.data);
  };

  const handleAssignCustomer = async (customerId, agentId) => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customers/${customerId}/assign`, { agentId });
    fetchCustomers();
  };

  const handleUnassignCustomer = async (customerId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/customers/${customerId}/unassign`);
      toast.success('Customer unassigned successfully');
      fetchCustomers();
    } catch (error) {
      toast.error('Error unassigning customer: ' + error.response?.data?.message || error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const renderSmartPagination = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, idx) => (
      <button
        key={idx}
        onClick={() => page !== "..." && handlePageChange(page)}
        disabled={page === "..." || page === currentPage}
        className={`px-3 py-1 rounded 
          ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
      >
        {page}
      </button>
    ));
  };

  return (
    <>
      <Helmet>
        <title>Customer List</title>
      </Helmet>
      <PageHeader
        title="customers"
        actions={
          <div className="flex justify-end p-4 max-md:p-0 max-md:mt-10 space-x-4 flex-grow flex-wrap max-md:gap-4 mt-10">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
              className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            >
              <FaTable size={15} />
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              onClick={() => setViewMode('card')}
              className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            >
              <Grid2x2 size={15} />
            </Button>
            {user.role === 'admin' && (
              <Dialog>
                <DialogTrigger
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'bg-color-primary hover:bg-color-primary-light text-fg-on-accent text-center flex items-center gap-2'
                  )}
                >
                  <FileChartColumn className="w-5 h-5" />
                  Upload CSV
                </DialogTrigger>
                <DialogContent className="w-fit p-4">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col md:flex-row border border-gray-300 shadow-sm overflow-hidden">
                    <div className="md:w-[30%]">
                      <Button
                        onClick={() => {}}
                        className="w-full h-12 rounded-none"
                        variant={'default'}
                      >
                        Customer Data
                      </Button>
                    </div>
                    <div className="p-4 md:w-[70%]">
                      <CustomerUpload onUploadSuccess={fetchCustomers} />
                    </div>
                  </div>
                  
                </DialogContent>
              </Dialog>
            )}

              {user.role === 'admin' && (
           <Button>

           <Link
              to="DailyView"
              className="" >
                   Daily View
              </Link>
           </Button>
            )}
           
          </div>
        }
      />
      
      <div className="flex gap-5 w-full my-4 justify-between items-center">
        <CustomerFilters
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          agents={agents}
          onRefresh={fetchCustomers}
          totalCustomers={totalCustomers}
        />
      </div>
      <div className="bg-background">
        {viewMode === 'card' ? (
          <CustomerCardView
            customers={customers}
            agents={agents}
            user={user}
            handleAssignCustomer={handleAssignCustomer}
            handleUnassignCustomer={handleUnassignCustomer}
          />
        ) : viewMode === 'table' ? (
          <CustomerTableView
            customers={customers}
            agents={agents}
            user={user}
            handleAssignCustomer={handleAssignCustomer}
            handleUnassignCustomer={handleUnassignCustomer}
          />
        ) : null}
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {renderSmartPagination()}
      </div>
      <ToastContainer />
    </>
  );
};

export default CustomerList;
