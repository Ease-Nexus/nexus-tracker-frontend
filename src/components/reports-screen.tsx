'use client';

import { endOfDay, format, isAfter, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
} from 'lucide-react';
import { useId, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface CompletedTimer {
  id: string;
  badgeNumber: string;
  totalMinutes: number;
  startTime: Date;
  endTime: Date;
  totalElapsed: number;
  date: Date;
}

interface ReportsScreenProps {
  completedTimers: CompletedTimer[];
}

export function ReportsScreen({ completedTimers }: ReportsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [sortBy, setSortBy] = useState<'date' | 'badge' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const badgeNumberInput = useId();

  // Filter timers based on search and date filters
  const filteredTimers = completedTimers.filter((timer) => {
    const matchesSearch = timer.badgeNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDateFrom =
      !dateFrom ||
      isAfter(timer.date, startOfDay(dateFrom)) ||
      timer.date.getTime() === startOfDay(dateFrom).getTime();
    const matchesDateTo =
      !dateTo ||
      isBefore(timer.date, endOfDay(dateTo)) ||
      timer.date.getTime() === endOfDay(dateTo).getTime();

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Sort filtered timers
  const sortedTimers = [...filteredTimers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = a.date.getTime() - b.date.getTime();
        break;
      case 'badge':
        comparison = a.badgeNumber.localeCompare(b.badgeNumber);
        break;
      case 'duration':
        comparison = a.totalElapsed - b.totalElapsed;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const exportToCSV = () => {
    const headers = [
      'Crachá',
      'Data',
      'Hora Início',
      'Hora Término',
      'Tempo Total',
    ];
    const csvContent = [
      headers.join(','),
      ...sortedTimers.map((timer) =>
        [
          timer.badgeNumber,
          format(timer.date, 'dd/MM/yyyy', { locale: ptBR }),
          format(timer.startTime, 'HH:mm', { locale: ptBR }),
          format(timer.endTime, 'HH:mm', { locale: ptBR }),
          formatDuration(timer.totalElapsed),
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `relatorio-timers-${format(new Date(), 'yyyy-MM-dd')}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Simple PDF export using browser print
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Timers</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Relatório de Timers - Pista de Patinação</h1>
          <div class="summary">
            <p><strong>Período:</strong> ${dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: ptBR }) : 'Início'} - ${dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: ptBR }) : 'Hoje'}</p>
            <p><strong>Total de registros:</strong> ${sortedTimers.length}</p>
            <p><strong>Gerado em:</strong> ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Crachá</th>
                <th>Data</th>
                <th>Hora Início</th>
                <th>Hora Término</th>
                <th>Tempo Total</th>
              </tr>
            </thead>
            <tbody>
              ${sortedTimers
                .map(
                  (timer) => `
                <tr>
                  <td>${timer.badgeNumber}</td>
                  <td>${format(timer.date, 'dd/MM/yyyy', { locale: ptBR })}</td>
                  <td>${format(timer.startTime, 'HH:mm', { locale: ptBR })}</td>
                  <td>${format(timer.endTime, 'HH:mm', { locale: ptBR })}</td>
                  <td>${formatDuration(timer.totalElapsed)}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground">
            Visualize e exporte o histórico de timers finalizados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtre os dados por crachá, período ou ordene os resultados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by badge */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor={badgeNumberInput}>
                Buscar por crachá
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id={badgeNumberInput}
                  placeholder="Número do crachá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date from */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="#">
                Data inicial
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateFrom && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom
                      ? format(dateFrom, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date to */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="#">
                Data final
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateTo && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo
                      ? format(dateTo, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort options */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="#">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value: 'date' | 'badge' | 'duration') =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="badge">Crachá</SelectItem>
                    <SelectItem value="duration">Duração</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortOrder}
                  onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">↓</SelectItem>
                    <SelectItem value="asc">↑</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {(searchTerm || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
              className="text-sm"
            >
              Limpar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            {sortedTimers.length} registro{sortedTimers.length !== 1 ? 's' : ''}{' '}
            encontrado
            {sortedTimers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedTimers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum timer finalizado encontrado</p>
              <p className="text-sm">
                Ajuste os filtros ou finalize alguns timers para ver os dados
                aqui
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crachá</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora Início</TableHead>
                    <TableHead>Hora Término</TableHead>
                    <TableHead>Tempo Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTimers.map((timer) => (
                    <TableRow key={timer.id}>
                      <TableCell className="font-medium">
                        #{timer.badgeNumber}
                      </TableCell>
                      <TableCell>
                        {format(timer.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {format(timer.startTime, 'HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {format(timer.endTime, 'HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {formatDuration(timer.totalElapsed)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Finalizado
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
