@echo off
echo ========================================
echo Creating Invoice Project Folder Structure
echo ========================================
echo.

REM Create main directories
echo Creating main directories...
mkdir components 2>nul
mkdir components\ui 2>nul
mkdir components\figma 2>nul
mkdir utils 2>nul
mkdir types 2>nul
mkdir data 2>nul
mkdir styles 2>nul
mkdir imports 2>nul
mkdir guidelines 2>nul

echo.
echo Creating placeholder files...

REM Create main files
type nul > App.tsx
type nul > package.json
type nul > README.md
type nul > .gitignore

REM Create component files
type nul > components\Navigation.tsx
type nul > components\Dashboard.tsx
type nul > components\DashboardView.tsx
type nul > components\AccountsView.tsx
type nul > components\ClientList.tsx
type nul > components\InvoiceCard.tsx
type nul > components\InvoiceForm.tsx
type nul > components\InvoiceList.tsx
type nul > components\InvoiceViewer.tsx
type nul > components\EmailScheduler.tsx
type nul > components\TemplateForm.tsx
type nul > components\TemplateList.tsx

REM Create UI component files
type nul > components\ui\accordion.tsx
type nul > components\ui\alert-dialog.tsx
type nul > components\ui\alert.tsx
type nul > components\ui\aspect-ratio.tsx
type nul > components\ui\avatar.tsx
type nul > components\ui\badge.tsx
type nul > components\ui\breadcrumb.tsx
type nul > components\ui\button.tsx
type nul > components\ui\calendar.tsx
type nul > components\ui\card.tsx
type nul > components\ui\carousel.tsx
type nul > components\ui\chart.tsx
type nul > components\ui\checkbox.tsx
type nul > components\ui\collapsible.tsx
type nul > components\ui\command.tsx
type nul > components\ui\context-menu.tsx
type nul > components\ui\dialog.tsx
type nul > components\ui\drawer.tsx
type nul > components\ui\dropdown-menu.tsx
type nul > components\ui\form.tsx
type nul > components\ui\hover-card.tsx
type nul > components\ui\input-otp.tsx
type nul > components\ui\input.tsx
type nul > components\ui\label.tsx
type nul > components\ui\menubar.tsx
type nul > components\ui\navigation-menu.tsx
type nul > components\ui\pagination.tsx
type nul > components\ui\popover.tsx
type nul > components\ui\progress.tsx
type nul > components\ui\radio-group.tsx
type nul > components\ui\resizable.tsx
type nul > components\ui\scroll-area.tsx
type nul > components\ui\select.tsx
type nul > components\ui\separator.tsx
type nul > components\ui\sheet.tsx
type nul > components\ui\sidebar.tsx
type nul > components\ui\skeleton.tsx
type nul > components\ui\slider.tsx
type nul > components\ui\sonner.tsx
type nul > components\ui\switch.tsx
type nul > components\ui\table.tsx
type nul > components\ui\tabs.tsx
type nul > components\ui\textarea.tsx
type nul > components\ui\toggle-group.tsx
type nul > components\ui\toggle.tsx
type nul > components\ui\tooltip.tsx
type nul > components\ui\use-mobile.ts
type nul > components\ui\utils.ts

REM Create figma component files
type nul > components\figma\ImageWithFallback.tsx

REM Create utility files
type nul > utils\currencyConverter.ts
type nul > utils\dateCalculator.ts
type nul > utils\invoiceGenerator.ts
type nul > utils\nbgExchangeRate.ts
type nul > utils\piIdGenerator.ts

REM Create data and type files
type nul > data\mockData.ts
type nul > types\index.ts

REM Create style files
type nul > styles\globals.css

REM Create import files
type nul > imports\Acoounts.tsx
type nul > imports\Dashboard-21-462.tsx
type nul > imports\svg-i3nnj659kh.ts
type nul > imports\svg-p3nn7paigw.ts
type nul > imports\svg-wvgpc.tsx

REM Create guidelines
type nul > guidelines\Guidelines.md

echo.
echo ========================================
echo Folder structure created successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Copy code from Figma Make into each file
echo 2. Run 'npm install' to install dependencies
echo 3. Run 'npm run dev' to start the development server
echo.
echo All empty files have been created as placeholders.
echo You can now copy the code content into each file.
echo.
pause
