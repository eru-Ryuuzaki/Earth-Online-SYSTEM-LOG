import React, { useState, useCallback } from "react";
import SystemConfirmDialog from "../SystemConfirmDialog";
import { useSystemLogs } from "../../hooks/useSystemLogs";
import {
  BookOpen,
  Settings,
  ArrowLeft,
  Plus,
  RefreshCw,
  Filter,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import SystemLogList from "./SystemLogList";
import SystemLogDetail from "./SystemLogDetail";

const SystemLogModule = ({
  onToggleSettings,
  playerStats,
  onUpdateVitals,
  onLogAdded,
  selectedLog,
  onSelectLog: setSelectedLog,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { logs, addLog, refreshLogs, deleteLog, updateLog, loading } =
    useSystemLogs();

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      refreshLogs(newFilters);
    },
    [refreshLogs],
  );

  const handleSave = useCallback(
    async (content, type, date, category, metadata) => {
      let success = false;
      if (editingLog) {
        success = await updateLog(editingLog._id, {
          content,
          type,
          logDate: date,
          category,
          metadata,
        });
        if (success) addToast(t("logs.toasts.update_success"), "SUCCESS");
      } else {
        success = await addLog(content, type, date, category, metadata);
        if (success) {
          if (onLogAdded) onLogAdded();
          try {
            if (metadata && onUpdateVitals) {
              onUpdateVitals({
                hp: parseInt(metadata.energy) || playerStats.hp,
              });
            }
          } catch (e) {}
          addToast(t("logs.toasts.success_save"), "SUCCESS");
        }
      }

      if (success) {
        setIsCreating(false);
        setEditingLog(null);
        refreshLogs(filters);
        if (onLogAdded) onLogAdded();
      }
    },
    [
      editingLog,
      updateLog,
      addLog,
      t,
      onLogAdded,
      onUpdateVitals,
      playerStats.hp,
      filters,
      refreshLogs,
      addToast,
    ],
  );

  const handleDeleteClick = useCallback((e, id) => {
    e.stopPropagation();
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;
    const success = await deleteLog(deleteId);
    if (success) {
      addToast(t("logs.toasts.delete_success"), "SUCCESS");
      if (selectedLog?._id === deleteId) setSelectedLog(null);
      if (onLogAdded) onLogAdded();
    }
    setDeleteId(null);
  }, [
    deleteId,
    deleteLog,
    t,
    selectedLog,
    setSelectedLog,
    onLogAdded,
    addToast,
  ]);

  const handleEdit = useCallback(
    (e, log) => {
      e.stopPropagation();
      setEditingLog(log);
      setIsCreating(true);
      setSelectedLog(null);
    },
    [setSelectedLog],
  );

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
    setEditingLog(null);
  }, []);

  const handleSelectLog = useCallback(
    (log) => {
      setSelectedLog(log);
      setIsCreating(false);
      setEditingLog(null);
    },
    [setSelectedLog],
  );

  const handleRefresh = useCallback(
    () => refreshLogs(filters),
    [refreshLogs, filters],
  );

  const handleToggleFilter = useCallback(
    () => setIsFilterOpen((prev) => !prev),
    [],
  );

  const handleCreateNew = useCallback(() => {
    setIsCreating(true);
    setEditingLog(null);
    setSelectedLog(null);
  }, [setSelectedLog]);

  const handleMobileBack = useCallback(() => {
    setSelectedLog(null);
    setIsCreating(false);
  }, [setSelectedLog]);

  const handleCloseDialog = useCallback(() => setIsDeleteDialogOpen(false), []);

  return (
    <div className="max-w-7xl mx-auto w-full h-full md:h-[600px] bg-gray-950/95 border border-cyan-500/20 rounded-xl text-white overflow-hidden font-sans relative mb-0 md:mb-6 backdrop-blur-xl shadow-[0_0_40px_rgba(8,145,178,0.1)] flex flex-col">
      <SystemConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={confirmDelete}
        title="DELETE LOG ENTRY"
        message="This action will permanently erase the selected memory block. This data cannot be recovered. Are you sure you want to proceed?"
        confirmText="DELETE"
        type="DANGER"
      />

      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-black/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 hidden md:block">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          {/* Mobile Back Button */}
          {(selectedLog || isCreating) && (
            <button
              onClick={handleMobileBack}
              className="md:hidden p-2 -ml-2 text-cyan-400 hover:bg-white/10 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <h2 className="text-sm font-bold text-white tracking-wide shadow-black drop-shadow-md">
              {selectedLog || isCreating
                ? isCreating
                  ? t("logs.new_log")
                  : "LOG DETAILS"
                : t("logs.title")}
            </h2>
            <div className="text-[10px] text-cyan-400/80 font-mono hidden md:block">
              EARTH ONLINE V2.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isCreating && (
            <div className="flex gap-2 text-xs font-mono bg-black/40 p-1 rounded-lg border border-white/10">
              <button
                onClick={handleToggleFilter}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                  isFilterOpen
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              <div className="w-px bg-white/10 mx-1 my-1"></div>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-bold">NEW</span>
              </button>
              <div className="w-px bg-white/10 mx-1 my-1"></div>
              <button
                onClick={handleRefresh}
                className={`flex items-center justify-center w-8 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors ${
                  loading ? "animate-spin text-cyan-400" : ""
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={onToggleSettings}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: LIST */}
        <SystemLogList
          logs={logs}
          loading={loading}
          selectedLog={selectedLog}
          isCreating={isCreating}
          onSelectLog={handleSelectLog}
          onEdit={handleEdit}
          onDeleteClick={handleDeleteClick}
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          isFilterOpen={isFilterOpen}
        />

        {/* RIGHT PANEL: DETAIL / CREATE / EMPTY */}
        <SystemLogDetail
          selectedLog={selectedLog}
          isCreating={isCreating}
          editingLog={editingLog}
          onClose={handleSelectLog.bind(null, null)}
          onCancelCreate={handleCancelCreate}
          onSave={handleSave}
          playerStats={playerStats}
          onCreateClick={handleCreateNew}
        />
      </div>
    </div>
  );
};

export default SystemLogModule;
