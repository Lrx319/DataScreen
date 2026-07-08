export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS host_detail (
  host_id VARCHAR(64) PRIMARY KEY,
  host_name VARCHAR(128) NOT NULL,
  ip_addr VARCHAR(45) NOT NULL,
  room VARCHAR(32) NOT NULL,
  rack VARCHAR(32),
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mod_detail (
  mod_id VARCHAR(32) PRIMARY KEY,
  mod_name VARCHAR(128) NOT NULL,
  mod_desc VARCHAR(256),
  unit VARCHAR(16),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tsar_detail (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  host_id VARCHAR(64) NOT NULL,
  mod_id VARCHAR(32) NOT NULL,
  collect_time DATETIME NOT NULL,
  value DOUBLE NOT NULL,
  FOREIGN KEY (host_id) REFERENCES host_detail(host_id),
  FOREIGN KEY (mod_id) REFERENCES mod_detail(mod_id),
  INDEX idx_host_time (host_id, collect_time),
  INDEX idx_mod_time (mod_id, collect_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const INSERT_MOD_DETAIL_SQL = `
INSERT INTO mod_detail (mod_id, mod_name, mod_desc, unit) VALUES
('cpu', 'CPU使用率', 'CPU占用百分比', '%'),
('mem', '内存使用率', '内存占用百分比', '%'),
('disk_util', '磁盘使用率', '磁盘空间占用百分比', '%'),
('disk_io_wait', '磁盘IO等待', '磁盘IO等待时间', 'ms'),
('net_in', '网络入流量', '网络入站流量', 'KB/s'),
('net_out', '网络出流量', '网络出站流量', 'KB/s'),
('load_avg', '系统负载', '系统平均负载', '')
ON DUPLICATE KEY UPDATE mod_name = VALUES(mod_name), mod_desc = VALUES(mod_desc), unit = VALUES(unit);
`
